const Booking = require('../models/booking');
const Course = require('../models/course');
const User = require('../models/user');
const Notification = require('../models/notification');
const { sendBookingConfirmationEmail } = require('../utils/emailService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { courseId, paymentMethod } = req.body;

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if course has available spots
        if (course.enrolledStudents.length >= course.capacity) {
            return res.status(400).json({ message: 'Course is already full' });
        }

        // Check if user is already enrolled
        const alreadyEnrolled = course.enrolledStudents.some(
            student => student.toString() === req.user._id.toString()
        );

        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Create booking object
        const booking = new Booking({
            course: courseId,
            student: req.user._id,
            amount: course.price,
            paymentMethod
        });

        if (paymentMethod === 'online') {
            // Create Stripe payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: course.price * 100, // Stripe uses cents
                currency: 'usd',
                description: `Booking for ${course.title}`,
                metadata: {
                    courseId: course._id.toString(),
                    studentId: req.user._id.toString()
                }
            });

            booking.paymentId = paymentIntent.id;

            // Save booking with pending status
            await booking.save();

            // Return client secret for payment completion
            res.status(201).json({
                booking,
                clientSecret: paymentIntent.client_secret
            });
        } else {
            // For cash payment, save booking as pending
            await booking.save();

            // Add student to enrolled list
            course.enrolledStudents.push(req.user._id);
            await course.save();

            // Create notification for instructor
            await Notification.create({
                recipient: course.instructor,
                type: 'booking',
                title: 'New Booking',
                message: `${req.user.name} has booked your course "${course.title}" with cash payment option.`,
                relatedResource: 'booking',
                resourceId: booking._id
            });

            // Send confirmation email
            try {
                await sendBookingConfirmationEmail(req.user.email, {
                    courseName: course.title,
                    bookingId: booking._id,
                    amount: course.price,
                    paymentMethod: 'cash'
                });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }

            res.status(201).json({ booking });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('course', 'title description price schedule')
            .populate('student', 'name email');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user is authorized to view this booking
        if (
            booking.student._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin' &&
            !await isCourseInstructor(booking.course._id, req.user._id)
        ) {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ student: req.user._id })
            .populate('course', 'title description price schedule imageUrl')
            .sort({ bookingDate: -1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get instructor bookings
// @route   GET /api/bookings/instructor-bookings
// @access  Private/Instructor
const getInstructorBookings = async (req, res) => {
    try {
        // Get all courses by this instructor
        const instructorCourses = await Course.find({ instructor: req.user._id });
        const courseIds = instructorCourses.map(course => course._id);

        // Find bookings for these courses
        const bookings = await Booking.find({ course: { $in: courseIds } })
            .populate('course', 'title description price schedule')
            .populate('student', 'name email')
            .sort({ bookingDate: -1 });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Instructor or Admin
const updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check authorization
        const isInstructor = await isCourseInstructor(booking.course, req.user._id);
        if (!isInstructor && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        const updatedBooking = await booking.save();

        // Create notification for student
        await Notification.create({
            recipient: booking.student,
            type: 'booking',
            title: 'Booking Update',
            message: `Your booking status has been updated to: ${status || booking.status}`,
            relatedResource: 'booking',
            resourceId: booking._id
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the booking belongs to the user
        if (booking.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'cancelled';

        // If payment was completed online, initiate refund
        if (booking.paymentMethod === 'online' && booking.paymentStatus === 'completed') {
            try {
                const refund = await stripe.refunds.create({
                    payment_intent: booking.paymentId,
                });

                booking.paymentStatus = 'refunded';
            } catch (refundError) {
                console.error('Error processing refund:', refundError);
                return res.status(400).json({ message: 'Error processing refund', error: refundError.message });
            }
        }

        await booking.save();

        // Remove student from course enrolled list
        const course = await Course.findById(booking.course);
        if (course) {
            course.enrolledStudents = course.enrolledStudents.filter(
                id => id.toString() !== booking.student.toString()
            );
            await course.save();
        }

        // Notify instructor
        await Notification.create({
            recipient: course.instructor,
            type: 'booking',
            title: 'Booking Cancelled',
            message: `A booking for "${course.title}" has been cancelled.`,
            relatedResource: 'booking',
            resourceId: booking._id
        });

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Webhook for Stripe payment completion
// @route   POST /api/bookings/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        try {
            // Find the booking by payment intent ID
            const booking = await Booking.findOne({ paymentId: paymentIntent.id });

            if (booking) {
                booking.paymentStatus = 'completed';
                await booking.save();

                // Add student to the course's enrolled list
                const course = await Course.findById(booking.course);
                if (course && !course.enrolledStudents.includes(booking.student)) {
                    course.enrolledStudents.push(booking.student);
                    await course.save();
                }

                // Notify student and instructor
                const student = await User.findById(booking.student);
                const instructor = await User.findById(course.instructor);

                // Create notifications
                await Notification.create({
                    recipient: student._id,
                    type: 'payment',
                    title: 'Payment Successful',
                    message: `Your payment for "${course.title}" has been processed successfully.`,
                    relatedResource: 'booking',
                    resourceId: booking._id
                });

                await Notification.create({
                    recipient: instructor._id,
                    type: 'booking',
                    title: 'New Student Enrolled',
                    message: `${student.name} has enrolled in your course "${course.title}".`,
                    relatedResource: 'booking',
                    resourceId: booking._id
                });

                // Send email notification
                try {
                    await sendBookingConfirmationEmail(student.email, {
                        courseName: course.title,
                        bookingId: booking._id,
                        amount: booking.amount,
                        paymentMethod: 'online'
                    });
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                }
            }
        } catch (error) {
            console.error('Error processing successful payment:', error);
        }
    }

    res.json({ received: true });
};

// Helper function to check if a user is the instructor of a course
async function isCourseInstructor(courseId, userId) {
    const course = await Course.findById(courseId);
    return course && course.instructor.toString() === userId.toString();
}

module.exports = {
    createBooking,
    getBookingById,
    getMyBookings,
    getInstructorBookings,
    updateBookingStatus,
    cancelBooking,
    stripeWebhook
};
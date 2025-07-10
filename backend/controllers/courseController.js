const Course = require('../models/course');
const User = require('../models/user');
const Session = require('../models/session');
const Review = require('../models/review');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            duration,
            schedule,
            capacity,
            category,
            imageUrl
        } = req.body;

        // Verify the user is an instructor
        if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create courses' });
        }

        const course = await Course.create({
            title,
            description,
            instructor: req.user._id,
            price,
            duration,
            schedule,
            capacity,
            category,
            imageUrl
        });

        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Build filter object
        const keyword = req.query.keyword
            ? { title: { $regex: req.query.keyword, $options: 'i' } }
            : {};

        const categoryFilter = req.query.category
            ? { category: req.query.category }
            : {};

        const priceFilter = req.query.maxPrice
            ? { price: { $lte: Number(req.query.maxPrice) } }
            : {};

        const filter = {
            ...keyword,
            ...categoryFilter,
            ...priceFilter,
            isActive: true
        };

        const count = await Course.countDocuments(filter);

        const courses = await Course.find(filter)
            .populate('instructor', 'name email')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            courses,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email')
            .populate('enrolledStudents', 'name email');

        if (course) {
            // Get course ratings
            const reviews = await Review.find({ course: course._id });
            const avgRating = reviews.length > 0
                ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
                : 0;

            // Get course sessions
            const sessions = await Session.find({ course: course._id })
                .sort({ date: 1, startTime: 1 });

            res.json({
                ...course._doc,
                reviews,
                avgRating,
                reviewCount: reviews.length,
                sessions
            });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is course instructor or admin
        if (
            course.instructor.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const {
            title,
            description,
            price,
            duration,
            schedule,
            capacity,
            category,
            imageUrl,
            isActive
        } = req.body;

        if (title) course.title = title;
        if (description) course.description = description;
        if (price) course.price = price;
        if (duration) course.duration = duration;
        if (schedule) course.schedule = schedule;
        if (capacity) course.capacity = capacity;
        if (category) course.category = category;
        if (imageUrl) course.imageUrl = imageUrl;
        if (isActive !== undefined) course.isActive = isActive;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is course instructor or admin
        if (
            course.instructor.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get instructor courses
// @route   GET /api/courses/instructor
// @access  Private/Instructor
const getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new review
// @route   POST /api/courses/:id/reviews
// @access  Private
const createCourseReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user has booked this course
        const isEnrolled = course.enrolledStudents.some(
            (student) => student.toString() === req.user._id.toString()
        );

        if (!isEnrolled && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'You must be enrolled in the course to leave a review'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            course: req.params.id,
            user: req.user._id
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Course already reviewed' });
        }

        // Create review
        const review = await Review.create({
            user: req.user._id,
            course: req.params.id,
            instructor: course.instructor,
            rating: Number(rating),
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getInstructorCourses,
    createCourseReview
};
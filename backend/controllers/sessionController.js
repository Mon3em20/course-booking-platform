const Session = require('../models/session');
const Course = require('../models/course');
const Notification = require('../models/notification');
const User = require('../models/user');
const { createZoomMeeting, updateZoomMeeting } = require('../utils/zoomService');
const { sendSessionReminderEmail } = require('../utils/emailService');

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private/Instructor
const createSession = async (req, res) => {
    try {
        const {
            courseId,
            date,
            startTime,
            endTime,
            title,
            description,
            createZoomMeeting: shouldCreateZoom
        } = req.body;

        // Verify course exists and user is the instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create sessions for this course' });
        }

        // Create session object
        const session = new Session({
            course: courseId,
            date,
            startTime,
            endTime,
            title,
            description
        });

        // If Zoom meeting should be created
        if (shouldCreateZoom) {
            try {
                const meetingDate = new Date(date);
                const [hours, minutes] = startTime.split(':').map(Number);
                meetingDate.setHours(hours, minutes);

                // Duration in minutes
                const [endHours, endMinutes] = endTime.split(':').map(Number);
                const duration = (endHours * 60 + endMinutes) - (hours * 60 + minutes);

                const meeting = await createZoomMeeting({
                    topic: title,
                    agenda: description || `Session for ${course.title}`,
                    start_time: meetingDate.toISOString(),
                    duration // in minutes
                });

                session.zoomMeetingId = meeting.id;
                session.zoomJoinUrl = meeting.join_url;
                session.zoomStartUrl = meeting.start_url;
            } catch (zoomError) {
                console.error('Error creating Zoom meeting:', zoomError);
                // Continue without Zoom if there's an error
            }
        }

        await session.save();

        // Notify enrolled students
        const enrolledStudents = course.enrolledStudents;
        if (enrolledStudents && enrolledStudents.length > 0) {
            const notifications = enrolledStudents.map(student => ({
                recipient: student,
                type: 'session',
                title: 'New Session Scheduled',
                message: `A new session "${title}" has been scheduled for "${course.title}" on ${new Date(date).toLocaleDateString()}, ${startTime}.`,
                relatedResource: 'session',
                resourceId: session._id
            }));

            await Notification.insertMany(notifications);
        }

        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('course', 'title description instructor');

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user has access to this session
        const course = await Course.findById(session.course._id);
        const isEnrolled = course.enrolledStudents.some(
            id => id.toString() === req.user._id.toString()
        );
        const isInstructor = course.instructor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isEnrolled && !isInstructor && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this session' });
        }

        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private/Instructor
const updateSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user is course instructor
        const course = await Course.findById(session.course);
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this session' });
        }

        const {
            date,
            startTime,
            endTime,
            title,
            description,
            updateZoomMeeting: shouldUpdateZoom
        } = req.body;

        if (date) session.date = date;
        if (startTime) session.startTime = startTime;
        if (endTime) session.endTime = endTime;
        if (title) session.title = title;
        if (description) session.description = description;

        // Update Zoom meeting if requested and session has a Zoom meeting
        if (shouldUpdateZoom && session.zoomMeetingId) {
            try {
                const meetingDate = new Date(session.date);
                const [hours, minutes] = session.startTime.split(':').map(Number);
                meetingDate.setHours(hours, minutes);

                // Duration in minutes
                const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                const duration = (endHours * 60 + endMinutes) - (hours * 60 + minutes);

                await updateZoomMeeting(session.zoomMeetingId, {
                    topic: session.title,
                    agenda: session.description || `Session for ${course.title}`,
                    start_time: meetingDate.toISOString(),
                    duration
                });
            } catch (zoomError) {
                console.error('Error updating Zoom meeting:', zoomError);
            }
        }

        const updatedSession = await session.save();

        // Notify enrolled students
        const enrolledStudents = course.enrolledStudents;
        if (enrolledStudents && enrolledStudents.length > 0) {
            const notifications = enrolledStudents.map(student => ({
                recipient: student,
                type: 'session',
                title: 'Session Updated',
                message: `Session "${title}" for "${course.title}" has been updated. Please check the new details.`,
                relatedResource: 'session',
                resourceId: session._id
            }));

            await Notification.insertMany(notifications);
        }

        res.json(updatedSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private/Instructor
const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user is course instructor
        const course = await Course.findById(session.course);
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this session' });
        }

        await session.deleteOne();

        // Notify enrolled students
        const enrolledStudents = course.enrolledStudents;
        if (enrolledStudents && enrolledStudents.length > 0) {
            const notifications = enrolledStudents.map(student => ({
                recipient: student,
                type: 'session',
                title: 'Session Cancelled',
                message: `Session "${session.title}" for "${course.title}" has been cancelled.`,
                relatedResource: 'session',
                resourceId: session._id
            }));

            await Notification.insertMany(notifications);
        }

        res.json({ message: 'Session removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get sessions by course
// @route   GET /api/sessions/course/:courseId
// @access  Private
const getSessionsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Verify user has access to the course
        const isEnrolled = course.enrolledStudents.some(
            id => id.toString() === req.user._id.toString()
        );
        const isInstructor = course.instructor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isEnrolled && !isInstructor && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view these sessions' });
        }

        const sessions = await Session.find({ course: courseId })
            .sort({ date: 1, startTime: 1 });

        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Record student attendance for session
// @route   PUT /api/sessions/:id/attendance
// @access  Private/Instructor
const recordAttendance = async (req, res) => {
    try {
        const { students } = req.body;
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user is course instructor
        const course = await Course.findById(session.course);
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to record attendance' });
        }

        // Update attendance records
        for (const studentData of students) {
            const { studentId, attended, joinTime, leaveTime } = studentData;

            // Find student in attendees array or add if not present
            const attendeeIndex = session.attendees.findIndex(
                a => a.student.toString() === studentId
            );

            if (attendeeIndex >= 0) {
                // Update existing record
                session.attendees[attendeeIndex].attended = attended;
                if (joinTime) session.attendees[attendeeIndex].joinTime = joinTime;
                if (leaveTime) session.attendees[attendeeIndex].leaveTime = leaveTime;
            } else {
                // Add new record
                session.attendees.push({
                    student: studentId,
                    attended,
                    joinTime,
                    leaveTime
                });
            }
        }

        await session.save();
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add materials to session
// @route   PUT /api/sessions/:id/materials
// @access  Private/Instructor
const addMaterials = async (req, res) => {
    try {
        const { name, fileUrl } = req.body;
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user is course instructor
        const course = await Course.findById(session.course);
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add materials' });
        }

        session.materials.push({
            name,
            fileUrl,
            uploadDate: new Date()
        });

        await session.save();

        // Notify enrolled students
        const enrolledStudents = course.enrolledStudents;
        if (enrolledStudents && enrolledStudents.length > 0) {
            const notifications = enrolledStudents.map(student => ({
                recipient: student,
                type: 'session',
                title: 'New Session Material',
                message: `New material "${name}" has been added to session "${session.title}" for "${course.title}".`,
                relatedResource: 'session',
                resourceId: session._id
            }));

            await Notification.insertMany(notifications);
        }

        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Send session reminders (used by a scheduled job)
// @route   POST /api/sessions/send-reminders
// @access  Private/Admin (or server only)
const sendSessionReminders = async (req, res) => {
    try {
        // Find sessions starting in the next 24 hours
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const upcomingSessions = await Session.find({
            date: {
                $gte: now,
                $lte: tomorrow
            }
        }).populate({
            path: 'course',
            select: 'title enrolledStudents instructor',
            populate: {
                path: 'enrolledStudents',
                select: 'name email'
            }
        });

        let remindersSent = 0;

        for (const session of upcomingSessions) {
            const course = session.course;
            const sessionDate = new Date(session.date);
            const sessionTime = `${session.startTime} - ${session.endTime}`;

            // Send reminders to enrolled students
            const students = course.enrolledStudents || [];

            for (const student of students) {
                // Create notification
                await Notification.create({
                    recipient: student._id,
                    type: 'reminder',
                    title: 'Upcoming Session Reminder',
                    message: `Reminder: You have a session for "${course.title}" scheduled on ${sessionDate.toLocaleDateString()} at ${session.startTime}.`,
                    relatedResource: 'session',
                    resourceId: session._id
                });

                // Send email
                try {
                    await sendSessionReminderEmail(student.email, {
                        studentName: student.name,
                        courseName: course.title,
                        sessionTitle: session.title,
                        sessionDate: sessionDate.toLocaleDateString(),
                        sessionTime,
                        zoomLink: session.zoomJoinUrl
                    });
                    remindersSent++;
                } catch (emailError) {
                    console.error('Error sending reminder email:', emailError);
                }
            }
        }

        res.json({ message: `Session reminders sent successfully: ${remindersSent}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createSession,
    getSessionById,
    updateSession,
    deleteSession,
    getSessionsByCourse,
    recordAttendance,
    addMaterials,
    sendSessionReminders
};
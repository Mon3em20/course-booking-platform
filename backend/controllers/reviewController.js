const Review = require('../models/review');
const Course = require('../models/course');
const User = require('../models/user');
const Notification = require('../models/notification');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Review.countDocuments({});

        const reviews = await Review.find({})
            .populate('user', 'name')
            .populate('course', 'title')
            .populate('instructor', 'name')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            reviews,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get reviews by course
// @route   GET /api/reviews/course/:courseId
// @access  Public
const getReviewsByCourse = async (req, res) => {
    try {
        const reviews = await Review.find({ course: req.params.courseId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get reviews for instructor
// @route   GET /api/reviews/instructor
// @access  Private/Instructor
const getInstructorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ instructor: req.user._id })
            .populate('user', 'name')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private/Instructor
const replyToReview = async (req, res) => {
    try {
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({ message: 'Reply is required' });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user is the instructor of this course
        if (review.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to reply to this review' });
        }

        review.reply = reply;
        review.replyDate = Date.now();

        const updatedReview = await review.save();

        // Notify the reviewer
        await Notification.create({
            recipient: review.user,
            type: 'system',
            title: 'Instructor Replied to Your Review',
            message: `The instructor has replied to your review for "${updatedReview.course.title}".`,
            relatedResource: 'review',
            resourceId: updatedReview._id
        });

        res.json(updatedReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllReviews,
    getReviewsByCourse,
    getInstructorReviews,
    deleteReview,
    replyToReview
};
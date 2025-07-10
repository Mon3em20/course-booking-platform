const express = require('express');
const {
    getAllReviews,
    getReviewsByCourse,
    getInstructorReviews,
    deleteReview,
    replyToReview
} = require('../controllers/reviewController');
const { protect, instructor, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, admin, getAllReviews);

router.get('/instructor', protect, instructor, getInstructorReviews);
router.get('/course/:courseId', getReviewsByCourse);

router.route('/:id')
    .delete(protect, admin, deleteReview);

router.post('/:id/reply', protect, instructor, replyToReview);

module.exports = router;
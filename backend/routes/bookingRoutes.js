const express = require('express');
const {
    createBooking,
    getBookingById,
    getMyBookings,
    getInstructorBookings,
    updateBookingStatus,
    cancelBooking,
    stripeWebhook
} = require('../controllers/bookingController');
const { protect, instructor } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe webhook doesn't need authentication
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.route('/')
    .post(protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);
router.get('/instructor-bookings', protect, instructor, getInstructorBookings);

router.route('/:id')
    .get(protect, getBookingById);

router.route('/:id/status')
    .put(protect, instructor, updateBookingStatus);

router.route('/:id/cancel')
    .put(protect, cancelBooking);

module.exports = router;
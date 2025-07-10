const express = require('express');
const {
    getAdminStats,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllCourses,
    getAllBookings,
    getRevenueReports
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply admin middleware to all routes in this router
router.use(protect, admin);

router.get('/stats', getAdminStats);

router.route('/users')
    .get(getAllUsers);

router.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.get('/courses', getAllCourses);
router.get('/bookings', getAllBookings);

router.get('/reports/revenue', getRevenueReports);

module.exports = router;
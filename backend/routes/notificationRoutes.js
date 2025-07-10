const express = require('express');
const {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getUserNotifications);

router.put('/read-all', markAllNotificationsAsRead);

router.route('/:id/read')
    .put(markNotificationAsRead);

router.route('/:id')
    .delete(deleteNotification);

module.exports = router;
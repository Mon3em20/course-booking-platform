const express = require('express');
const {
    createSession,
    getSessionById,
    updateSession,
    deleteSession,
    getSessionsByCourse,
    recordAttendance,
    addMaterials,
    sendSessionReminders
} = require('../controllers/sessionController');
const { protect, instructor, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, instructor, createSession);

router.route('/send-reminders')
    .post(protect, admin, sendSessionReminders);

router.route('/:id')
    .get(protect, getSessionById)
    .put(protect, instructor, updateSession)
    .delete(protect, instructor, deleteSession);

router.get('/course/:courseId', protect, getSessionsByCourse);

router.route('/:id/attendance')
    .put(protect, instructor, recordAttendance);

router.route('/:id/materials')
    .put(protect, instructor, addMaterials);

module.exports = router;
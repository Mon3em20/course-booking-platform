const express = require('express');
const {
    uploadCourseImage,
    uploadCourseMaterial,
    uploadMultipleFiles
} = require('../controllers/uploadController');
const { protect, instructor } = require('../middleware/authMiddleware');
const { upload, courseImage, courseMaterial, multipleFiles } = require('../utils/uploadService');

const router = express.Router();

// Course image upload route
router.post('/course-image', protect, instructor, courseImage, uploadCourseImage);

// Course material upload route
router.post('/course-material', protect, instructor, courseMaterial, uploadCourseMaterial);

// Multiple files upload route
router.post('/multiple', protect, instructor, multipleFiles, uploadMultipleFiles);

module.exports = router;
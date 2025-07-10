const express = require('express');
const {
    generateCertificate,
    getCertificateById,
    verifyCertificate,
    getStudentCertificates,
    getCourseCertificates
} = require('../controllers/certificateController');
const { protect, instructor } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, instructor, generateCertificate);

router.get('/student', protect, getStudentCertificates);
router.get('/course/:courseId', protect, instructor, getCourseCertificates);

// Public route for certificate verification
router.get('/verify/:certificateNumber', verifyCertificate);

router.route('/:id')
    .get(protect, getCertificateById);

module.exports = router;
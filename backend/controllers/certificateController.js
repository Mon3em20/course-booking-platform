const Certificate = require('../models/certificate');
const Course = require('../models/course');
const Booking = require('../models/booking');
const Session = require('../models/session');
const { generateCertificatePDF } = require('../utils/certificateGenerator');
const { nanoid } = require('nanoid');

// @desc    Generate certificate for student
// @route   POST /api/certificates
// @access  Private/Instructor
const generateCertificate = async (req, res) => {
    try {
        const { studentId, courseId, completionDate } = req.body;

        // Verify course exists and user is the instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to generate certificates for this course' });
        }

        // Check if student is enrolled
        const isEnrolled = course.enrolledStudents.some(
            id => id.toString() === studentId
        );

        if (!isEnrolled) {
            return res.status(400).json({ message: 'Student is not enrolled in this course' });
        }

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
            student: studentId,
            course: courseId
        });

        if (existingCertificate) {
            return res.status(400).json({ message: 'Certificate already exists for this student and course' });
        }

        // Generate unique certificate number
        const certificateNumber = `CERT-${nanoid(10)}`;

        // Create certificate record
        const certificate = await Certificate.create({
            student: studentId,
            course: courseId,
            completionDate: completionDate || new Date(),
            certificateNumber
        });

        // Generate PDF (mock implementation)
        try {
            const pdfUrl = await generateCertificatePDF(certificate);
            certificate.pdfUrl = pdfUrl;
            await certificate.save();
        } catch (pdfError) {
            console.error('Error generating PDF:', pdfError);
            // Continue without PDF if there's an error
        }

        res.status(201).json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
const getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('student', 'name email')
            .populate('course', 'title description instructor');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Check authorization
        if (
            certificate.student._id.toString() !== req.user._id.toString() &&
            certificate.course.instructor.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to view this certificate' });
        }

        res.json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Verify certificate by number
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
const verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({
            certificateNumber: req.params.certificateNumber
        })
            .populate('student', 'name')
            .populate('course', 'title');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found or invalid' });
        }

        // Return public verification info
        res.json({
            verified: true,
            studentName: certificate.student.name,
            courseName: certificate.course.title,
            completionDate: certificate.completionDate,
            issueDate: certificate.issueDate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get student certificates
// @route   GET /api/certificates/student
// @access  Private
const getStudentCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ student: req.user._id })
            .populate('course', 'title description imageUrl')
            .sort({ issueDate: -1 });

        res.json(certificates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Get course certificates (for instructors)
// @route   GET /api/certificates/course/:courseId
// @access  Private/Instructor
const getCourseCertificates = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is instructor for this course
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to access these certificates' });
        }

        const certificates = await Certificate.find({ course: req.params.courseId })
            .populate('student', 'name email')
            .sort({ issueDate: -1 });

        res.json(certificates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    generateCertificate,
    getCertificateById,
    verifyCertificate,
    getStudentCertificates,
    getCourseCertificates
};
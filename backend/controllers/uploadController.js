const path = require('path');

// @desc    Upload course image
// @route   POST /api/upload/course-image
// @access  Private/Instructor
const uploadCourseImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Get file path
        const filePath = req.file.path.replace(/\\/g, '/');
        const relativePath = filePath.split('uploads/')[1];
        const fileUrl = `/uploads/${relativePath}`;

        res.json({
            message: 'File uploaded successfully',
            fileUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Upload course materials
// @route   POST /api/upload/course-material
// @access  Private/Instructor
const uploadCourseMaterial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Get file path
        const filePath = req.file.path.replace(/\\/g, '/');
        const relativePath = filePath.split('uploads/')[1];
        const fileUrl = `/uploads/${relativePath}`;

        res.json({
            message: 'File uploaded successfully',
            fileUrl,
            fileName: req.file.originalname
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private/Instructor
const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Process all uploaded files
        const uploadedFiles = req.files.map(file => {
            const filePath = file.path.replace(/\\/g, '/');
            const relativePath = filePath.split('uploads/')[1];
            return {
                fileName: file.originalname,
                fileUrl: `/uploads/${relativePath}`,
                fileType: file.mimetype,
                fileSize: file.size
            };
        });

        res.json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    uploadCourseImage,
    uploadCourseMaterial,
    uploadMultipleFiles
};
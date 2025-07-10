const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');

        // Determine subdirectory based on file type
        let subDir = 'misc';
        if (file.mimetype.startsWith('image/')) {
            subDir = 'images';
        } else if (file.mimetype === 'application/pdf') {
            subDir = 'documents';
        } else if (file.mimetype.startsWith('video/')) {
            subDir = 'videos';
        }

        const fullPath = path.join(uploadDir, subDir);

        // Create directory if it doesn't exist
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
    },
    filename: function(req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// Check file type
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|zip/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, documents, videos, and archives are allowed.'));
    }
};

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
    fileFilter: fileFilter
});

module.exports = {
    upload,

    // Middleware for course image upload
    courseImage: upload.single('courseImage'),

    // Middleware for course materials upload
    courseMaterial: upload.single('courseMaterial'),

    // Middleware for multiple files upload
    multipleFiles: upload.array('files', 5)
};
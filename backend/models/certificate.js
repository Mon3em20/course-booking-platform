const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    certificateNumber: {
        type: String,
        required: true,
        unique: true,
    },
    completionDate: {
        type: Date,
        required: true,
    },
    pdfUrl: {
        type: String,
    },
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
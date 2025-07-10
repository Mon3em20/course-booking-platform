const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    zoomMeetingId: {
        type: String,
    },
    zoomJoinUrl: {
        type: String,
    },
    zoomStartUrl: {
        type: String,
    },
    attendees: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        attended: {
            type: Boolean,
            default: false,
        },
        joinTime: Date,
        leaveTime: Date,
    }],
    recordingUrl: {
        type: String,
    },
    materials: [{
        name: String,
        fileUrl: String,
        uploadDate: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
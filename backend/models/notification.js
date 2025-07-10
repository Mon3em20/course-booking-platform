const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['booking', 'session', 'payment', 'reminder', 'announcement', 'system'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    relatedResource: {
        type: String,
        enum: ['course', 'booking', 'session', 'payment', 'review'],
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
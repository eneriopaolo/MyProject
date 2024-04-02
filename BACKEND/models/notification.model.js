const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Notification Schema Model:
const notificationSchema = new Schema({
    content: {
        type: String,
        required: true,
        immutable: true
    },
    receivedAt: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    receivedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Friend Request Model:
const requestSchema = new Schema ({
    sentBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    receivedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    timeSent: {
        type: Date,
        required: true,
        immutable: true,
        default: () => Date.now()
    },
    requestStatus: {
        type: String,
        enum: {
            values: ['Pending', 'Accepted', 'Denied'],
            message: "Invalid Request Status."
        },
        default: 'Pending',
        required: true
    }
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
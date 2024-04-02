const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Message Schema Model:
const messageSchema = new Schema({
    message: {
        type: String,
        required: true,
        immutable: true
    },
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    timeSent: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
});
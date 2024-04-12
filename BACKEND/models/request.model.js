const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.model');

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

// Pre Hook for checking if there is an existing friend request between the two user.
requestSchema.pre('save', async function (next) {
    const reqBySender = await Request.findOne({sentBy: this.sentBy, receivedBy: this.receivedBy});
    if (reqBySender) { throw Error('You have already sent a request to this user.')};
    const reqByReceiver = await Request.findOne({sentBy: this.receivedBy, receivedBy: this.sentBy});
    if (reqByReceiver) { throw Error('This user has already sent you a friend request.')};
    next();
});

// Append UID to both users' friends field when friend request is accepted.
requestSchema.post('updateOne', async function (next) {
    if (requestStatus === 'Accepted') {
        const sender = await User.findOneAndUpdate(this.sentBy, {
            $push: {"friends": this.receivedBy}
        });
        const receiver = await User.findOneAndUpdate(this.receivedBy, {
            $push: {"friends": this.sentBy}
        });
    }
    next();
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
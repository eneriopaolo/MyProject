const Request = require('../models/request.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// View Friend Requests Received Function:
const viewFriendRequestsReceived = async(req, res) => {
    try {
        // Database CRUD Operation:
        const friendRequests = await Request.find({receivedBy: currentUID}).populate('sentBy', 'name');

        res.status(200).json(friendRequests);
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
    };
};

// View Friend Requests Sent Function:
const viewFriendRequestsSent = async(req, res) => {
    try {
        // Database CRUD Operation:
        const friendRequests = await Request.find({sentBy: currentUID}).populate('receivedBy', 'name');

        res.status(200).json(friendRequests);
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
    }
}

// Send Friend Request Function:
const sendFriendRequest = async(req, res) => {
    const { userid } = req.params;
    try {
        // Validation:
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(404).json({message: "User does not exist."});
        };
        if (userid === currentUID) {
            return res.status(400).json({message: "Cannot send friend request to yourself."});
        };
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({message: "User does not exist."});
        };
        const reqBySender = await Request.findOne({sentBy: currentUID, receivedBy: userid});
        if (reqBySender) { 
            return res.status(400).json({message: "You have already sent a request to this user."});
        };
        const reqByReceiver = await Request.findOne({sentBy: userid, receivedBy: currentUID});
        if (reqByReceiver) { 
            return res.status(400).json({message: "This user has already sent you a friend request."});
        };
        //const currUser = await User.findById(currentUID);
        //if (currUser.friends.map(friends=>friends.toString()).include(user._id.toString())) {
        //    return res.status(400).json({message: "You are already friends with this user."})
        //};
        
        // Database CRUD Operation:
        const friendRequest = Request.create({
            sentBy: currentUID,
            receivedBy: userid
        });

        res.status(201).json({message: `Successfully sent friend request to ${user.name}.`})
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
    };
};

// Respond to a Friend Request Function:
const respondFriendRequest = async(req, res) => {
    const { reqid } = req.params;
    const { action } = req.query;
    try {
        // Validation:
        if (!mongoose.Types.ObjectId.isValid(reqid)) {
            return res.status(404).json({message: "Request does not exist."});
        };
        const friendRequest = await Request.findById(reqid);
        if (!friendRequest) {
            return res.status(404).json({message: "Request does not exist."});
        };
        if (friendRequest.receivedBy.toString() !== currentUID) {
            return res.status(403).json({message: "Unauthorized Access: Cannot respond to requests not sent to you."});
        };
        
        // Database CRUD Operation:
        let response = '';
        action === 'accept' ? response = 'Accepted' : response = 'Denied';
        const friendRequestResponse = await Request.findByIdAndUpdate(reqid, {
            requestStatus: response
        });
        if (action === 'accept') {
            const sender = await User.findOneAndUpdate(friendRequest.sentBy, {
                $push: {"friends": friendRequest.receivedBy}
            });
            const receiver = await User.findOneAndUpdate(friendRequest.receivedBy, {
                $push: {"friends": friendRequest.sentBy}
            });
        }

        res.status(201).json({message: `Successfully ${response} the friend request.`});
    } catch (error) {
        res.status(400).json({message: error.message});
    };
};

// Cancel Friend Request Function:
const cancelFriendRequest = async(req, res) => {
    const { reqid } = req.params;
    try {
        // Validation:
        if (!mongoose.Types.ObjectId.isValid(reqid)) {
            return res.status(404).json({message: "Request does not exist."});
        };
        const friendRequest = Request.findById(reqid);
        if (!friendRequest) {
            return res.status(404).json({message: "Request does not exist."});
        };
        if (friendRequest.sentBy !== currentUID) {
            return res.status(403).json({message: "Unauthorized Access: Cannot cancel request of other users."})
        }

        // Database CRUD Operation:
        const deleteRequest = Request.findByIdAndDelete(reqid);

        res.status(200).json({message: "Successfully cancelled the friend request."})
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
    }
};

module.exports = {
    viewFriendRequestsReceived,
    viewFriendRequestsSent,
    sendFriendRequest,
    respondFriendRequest,
    cancelFriendRequest
}
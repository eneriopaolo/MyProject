const Request = require('../models/request.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Send Friend Request Function:
const sendFriendRequest = async(req, res) => {
    const { userid } = req.params;
    try {
        // Validation:
        if(!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(404).json({message: "User does not exist."});
        };
        const user = await User.findById(userid);
        if(!user) {
            return res.status(404).json({message: "User does not exist."});
        };

        // Database CRUD Operation:
        const friendRequest = Request.create({
            sentBy: currentUID,
            receivedBy: userid
        });

        res.status(201).json({message: "Successfully sent friend request."})
    } catch (error) {
        res.status(400).json({message: error.message});
    };
};

// Respond to a Friend Request Function:
const respondFriendRequest = async(req, res) => {
    const { reqid } = req.params;
    const { response } = req.body;
    try {
        // Validation:
        if(!mongoose.Types.ObjectId.isValid(reqid)) {
            return res.status(404).json({message: "Request does not exist."});
        };
        const friendRequest = Request.findById(reqid);
        if(!friendRequest) {
            return res.status(404).json({message: "Request does not exist."});
        };
        if(friendRequest.receivedBy !== currentUID) {
            return res.status(403).json({message: "Unauthorized Access: Cannot respond to requests not sent to you."});
        };

        // Database CRUD Operation:
        const friendRequestResponse = Request.findByIdAndUpdate(reqid, {
            requestStatus: response
        });

        res.status(201).json({message: `Successfully ${response} the friend request.`});
    } catch (error) {
        res.status(400).json({message: error.message});
    };
};

module.exports = {
    sendFriendRequest,
    respondFriendRequest
}
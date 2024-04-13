const express = require('express');
const router = express.Router();
const {
    viewFriendRequestsReceived,
    viewFriendRequestsSent,
    sendFriendRequest,
    respondFriendRequest,
    cancelFriendRequest
} = require('../controllers/request.controller');
const {authenticateToken} = require('../services/authtoken.service');

router.get('/requests-received', authenticateToken, viewFriendRequestsReceived);
router.get('/requests-sent', authenticateToken, viewFriendRequestsSent);
router.post('/:userid', authenticateToken, sendFriendRequest);
router.patch('/request/:reqid', authenticateToken, respondFriendRequest);
router.delete('/request/:reqid', authenticateToken, cancelFriendRequest);

module.exports = router;
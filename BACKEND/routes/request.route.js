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

router.get('/', authenticateToken, viewFriendRequestsReceived);
router.get('/sent', authenticateToken, viewFriendRequestsSent);
router.post('/:userid', authenticateToken, sendFriendRequest);
router.patch('/:reqid', authenticateToken, respondFriendRequest);
router.delete('/:reqid', authenticateToken, cancelFriendRequest);

module.exports = router;
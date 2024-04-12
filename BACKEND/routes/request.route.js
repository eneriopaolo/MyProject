const express = require('express');
const router = express.Router();
const {
    sendFriendRequest,
    respondFriendRequest
} = require('../controllers/request.controller');

router.post('/:userid', sendFriendRequest);
router.patch('/request/:reqid', respondFriendRequest);

module.exports = router;
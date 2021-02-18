const express = require('express');
const { body } = require('express-validator');
const { fetchChats, getChatMessages, sendMessages } = require('../controllers/chat');
const router = express.Router();
const isAuth = require('../middlewares/authMiddleware');

router.get('', isAuth, fetchChats);

router.get('/messages', isAuth, getChatMessages);

router.post('/sendMessage', isAuth, [
    body('message').notEmpty().withMessage('message is required'),
    body('messageType').notEmpty().withMessage('message Type is required'),
], sendMessages);

module.exports = router;
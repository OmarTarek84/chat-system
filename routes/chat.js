const express = require('express');
const { body } = require('express-validator');
const { fetchChats, getChatMessages, sendMessages, addChat, deleteChat, addUserToChat, leaveChat } = require('../controllers/chat');
const router = express.Router();
const isAuth = require('../middlewares/authMiddleware');

router.get('', isAuth, fetchChats);

router.get('/messages', isAuth, getChatMessages);

router.post('/sendMessage', isAuth, [
    body('message').notEmpty().withMessage('message is required'),
    body('messageType').notEmpty().withMessage('message Type is required'),
], sendMessages);

router.post('/add', isAuth, [
    body('users').notEmpty().withMessage('users are required')
], addChat);

router.delete('/delete', isAuth, deleteChat);

router.post('/addUserToChat', isAuth, [
    body('users').notEmpty().withMessage('users are required')
], addUserToChat);

router.put('/leaveChat', isAuth, leaveChat);


module.exports = router;
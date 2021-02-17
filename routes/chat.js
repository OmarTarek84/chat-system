const express = require('express');
const { fetchChats } = require('../controllers/chat');
const router = express.Router();
const isAuth = require('../middlewares/authMiddleware');

router.get('', isAuth, fetchChats);

module.exports = router;
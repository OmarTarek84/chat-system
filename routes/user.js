const express = require('express');
const { body } = require('express-validator');
const { getUser, updateProfile, getSignedUrl } = require('../controllers/user');
const router = express.Router();
const isAuth = require('../middlewares/authMiddleware');
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.get('', isAuth, getUser);

router.get('/getSignedUrl', isAuth, getSignedUrl);

router.put('/update', isAuth, [
    body('firstName').notEmpty().withMessage('First Name is required'),
    body('lastName').notEmpty().withMessage('Last Name is required'),
    body('email').notEmpty().withMessage('Email is required')
        .matches(emailRegex).withMessage('Email is not valid'),
    body('gender').notEmpty().withMessage('Gender is required'),
], updateProfile);

module.exports = router;
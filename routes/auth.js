const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/auth');
const router = express.Router();

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"\[\]{}%^&*:@~$+\-\(\)\}\{=#';(\\|\/)$|^(\\|\/).<>\\|`?_,])?[A-Za-z\d!"\[\]{}%^&*:$@\-=\(\)\}\{+~#';(\\|\/)$|^(\\|\/).<>\\|?_,`]{1,}$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/signup', [
    body('firstName').notEmpty().withMessage('First Name is required'),
    body('lastName').notEmpty().withMessage('Last Name is required'),
    body('email').notEmpty().withMessage('Email is required')
        .matches(emailRegex).withMessage('Email is not valid'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('password').notEmpty().withMessage('Password is required')
        .matches(passwordRegex).withMessage('Password should have at least one upper character, one lower character and one number'),
], signup);

router.put('/login', [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
], login);

module.exports = router;
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const db = require('../utils/dbConnect');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const hashedPassword = await bcryptjs.hash(req.body.password, 12);
        const response = await db.query(`insert into users (
            email,
            first_name,
            last_name,
            gender,
            password,
            createdat
        ) values (
            $1,
            $2,
            $3,
            $4,
            $5,
            NOW()
        )`, [
            req.body.email,
            req.body.firstName,
            req.body.lastName,
            req.body.gender,
            hashedPassword
        ]);

        if (response && response.rowCount > 0) {
            return res.status(200).json({message: 'success'});
        }
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: 'Server Error'});
    }

};


exports.login = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const foundUser = await db.query('select * from users where email = $1;', [req.body.email]);

        if (!foundUser || !foundUser.rows[0]) {
            return res.status(500).json({message: 'Incorrect Email or Password'});
        }

        const ifHashedPass = await bcryptjs.compare(req.body.password, foundUser.rows[0].password);
        if (!ifHashedPass) {
            return res.status(500).json({message: 'Incorrect Email or Password'});
        }

        const {password, user_id, createdat, ...user} = foundUser.rows[0];

        const token = await jwt.sign({...user, user_id: user_id}, process.env.TOKEN_SECRET, {
            expiresIn: '7d'
        });

        return res.status(200).json({
            ...user,
            token
        });
    } catch(err) {
        return res.status(500).json({message: 'Server Error'});
    }
};
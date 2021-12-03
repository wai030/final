const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const unauthenticated = require('../passport/unauthenticated');

router.get('/', unauthenticated, (req, res) => {
    res.render('register', {
        layout: false,
        message: req.flash('registration_err')
    });
});

router.post('/', unauthenticated, async (req, res) => {
    if (req.body.password !== req.body.r_password) {
        req.flash('registration_err', 'Mismatched password. Please enter the same password twice.');
        return res.redirect('/register');
    }
    try {
        const userExist = await User.findOne({ username: req.body.username });
        if (userExist) {
            req.flash('registration_err', 'Username already exists.');
            return res.redirect('/register');
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        await newUser.save();
        res.redirect('/login');
    } catch (e) {
        console.log('Status 400: ' + e.message);
        res.redirect('/register');
    }
});

module.exports = router;
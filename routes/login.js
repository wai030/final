const express = require('express');
const router = express.Router();
const passport = require('passport');
const unauthenticated = require('../passport/unauthenticated');

const initializePassport = require('../passport/passport-config');
initializePassport(passport);

router.get('/', unauthenticated, (req, res) => {
    res.render('login', { layout: false });
});

router.post('/', unauthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
}));

module.exports = router;

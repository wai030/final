const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Ureator = require('../models/user');

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await Ureator.findOne({ username: username });
        if (!user) {
            // done(error in this operation, user found)
            return done(null, false, { message: 'Invalid username or password.' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid username or password.' });
            }
        } catch (err) {
            console.log('Authenticate user error: ' + e.message);
            return done(err);
        }
    }
    
    passport.use(new localStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, authenticateUser));
    
    // after authenticate(local) -> serialize to session for remembering -> choose info to save to session
    // to lower the session space occupation -> retrieve the user id from the user object only
    // import to the extra property 'passport' created in session
    // passport: { user: 'the user id' }
    // when need to be called: req.session.passport.user <- {id: '...'}
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // retrieve user object from db through the user id -> save to req.user which is remembered for every further req
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Ureator.findById(id);
            done(null, user);
        } catch (err) {
            console.log('Deserialize user issue: ' + e.message);
            return done(err);
        }
    });
}

module.exports = initialize;
// if not in development environment -> do not parse the dotenv file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// npm dependencies - servers
const express = require('express');
const app = express();
const server = app.listen(3000, () => console.log(`Listening at http://localhost:3000`));

// others
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

// default view path
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts); // allows to create a layout file for all of HTML
// app.use(express.static(__dirname + 'public'));
app.use('*/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('*/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('*/languages', express.static(path.join(__dirname, 'public/languages')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: replace by JWT
const sessionStore = new MongoStore({
    mongoUrl: process.env.DATABASE_URL,
    collection: 'sessions'  // the name of the collection for session storage
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
// check req.session.passport.user !== null for every req <- if an user has logged in
// every if not null -> grab the user id -> deserializeUser to get the user object
// so that req.user is enabled to use
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes (controllers)
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/logout', require('./routes/logout'));
app.use((req, res) => { res.status(404).render('404', { title: 'Error', layout: false }) });

// db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

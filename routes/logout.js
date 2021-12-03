const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
router.use(methodOverride('_method'));

// allows the delete method being override by form posting from log out button
router.delete('/', (req, res) => {
    req.logOut();  // remove the user object from session.passport property
    res.redirect('/');
});

module.exports = router;
function unauthenticated(req, res, next) {
    if (req.isUnauthenticated()) {
        return next();
    }
    res.redirect(req.get('referer'));
}

module.exports = unauthenticated;
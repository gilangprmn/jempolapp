function checkRole(role) {
    return function (req, res, next) {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).send('Access denied.');
        }
    }
}

module.exports = checkRole;
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const token = req.cookies.omioClientJWT;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        req.currentUser = jwt.verify(token, process.env.JWT_CLIENT_PRIVATE_KEY);
        next();
    } catch (error) {
        res.status(400).send('Invalid Token!');
    }
}

module.exports = requireAuth;

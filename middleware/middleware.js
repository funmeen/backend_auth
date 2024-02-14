const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified.UserInfo;
        console.log('Token Verified');
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).send('Invalid Token');
    }
};

const permit = (...permittedRoles) => {
    return (req, res, next) => {
        const { user } = req;

        if (user && permittedRoles.includes(user.role)){
            next();
        } else {
            res.status(403).send('Forbidden: You do not have the required role');
        }
    }
}

module.exports = {
    verifyToken,
    permit
}
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('Verifying Token');
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token) return res.status(400).send('Invalid Token');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log('Token Verified');
        next();
    }
    catch (error){
        console.log('Token verification failed');
        res.status(400).send('Invalid Token');
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
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).send('access denied - bad token');

    const privateKey = config.get('jwtPrivateKey');

    console.log("privateKey: " + privateKey);
    console.log("token: " + token );

    try {
        const decoded = jwt.verify(token, privateKey); 
        req.user = decoded;
        console.log('decoded object: ' + decoded._id);
        next();
    } catch (ex) {
        console.log('Exception was: ' + ex.message);
        res.status(400).send('Token could not be verified');
    };
    
};
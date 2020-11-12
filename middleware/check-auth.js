const jwt = require('jsonwebtoken');
const config = require('config');
const ApiError = require('../error/apierror');

exports.checkAuth = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return next(ApiError.unauthorized("The request is unauthorized"));
    }
    
    const bearerToken = authHeader.split(' ')[1];
    req.token = bearerToken;

    jwt.verify(bearerToken, config.jwtSecret, (err, login) => {
        if (err) {
            return next(ApiError.forbidden("Can't verify token"));
        }    
        
        req.login = login;
        return next();
    })
}
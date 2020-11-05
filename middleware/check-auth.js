const jwt = require('jsonwebtoken')
const config = require('config')

exports.checkAuth = function(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({ message: "the request is unauthorized" })
    }
    
    const bearerToken = authHeader.split(' ')[1]
    req.token = bearerToken

    jwt.verify(bearerToken, config.jwtSecret, (err, login) => {
        if (err) return res.status(401).json({ message: "can't verify token" })
        req.login = login
        return next()
    })
}
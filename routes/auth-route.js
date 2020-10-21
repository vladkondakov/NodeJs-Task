const router = require('express').Router()
const { check } = require('express-validator')
const AuthController = require('../controllers/auth')

// POST /auth/login
router.post(
    '/login',
    [
        check('login').exists(),
        check('password').exists()
    ],
    AuthController.login
)

// POST /auth/refresh
router.post('/refresh', AuthController.generateNewToken)

// DELETE auth/logout
//header
router.delete('/logout', AuthController.logout)

module.exports = router
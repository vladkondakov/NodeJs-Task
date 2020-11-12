const router = require('express').Router()
const { check } = require('express-validator')
const AuthController = require('../controllers/auth')

// POST /auth
router.post(
    '/',
    [
        check('login').exists(),
        check('password').exists()
    ],
    AuthController.login
)

// POST /auth/refresh
router.post('/refresh', AuthController.generateNewToken)

// DELETE /auth
router.delete('/', AuthController.logout)

module.exports = router
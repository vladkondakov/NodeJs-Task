const router = require('express').Router()
const AuthController = require('../controllers/auth')
const { authValidation } = require('../middleware/auth-validation')

// POST /auth
router.post('/', authValidation, AuthController.login)

// POST /auth/refresh
router.post('/refresh', AuthController.generateNewToken)

// DELETE /auth
router.delete('/', AuthController.logout)

module.exports = router
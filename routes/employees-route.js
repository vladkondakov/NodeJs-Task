const router = require('express').Router()
const EmployeesController = require('../controllers/employees')
const { checkAuth } = require('../middleware/check-auth')
const { checkValidation } = require('../middleware/check-validation')

// GET /employees
router.get('/', checkAuth, EmployeesController.getPageEmployees)

// GET /employees/:id
router.get('/:id', checkAuth, EmployeesController.getEmployee)

// POST /employees
router.post('/:id', checkAuth, checkValidation, EmployeesController.editEmployee)

// PUT /employees
// This is for admin, only for development
router.put('/', EmployeesController.addEmployee)

module.exports = router
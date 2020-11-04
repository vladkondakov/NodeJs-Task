const router = require('express').Router()
const EmployeesController = require('../controllers/employees')
const { checkAuth } = require('../middleware/check-auth')

// GET /employees
router.get('/', checkAuth, EmployeesController.getEmployees)

// GET /employees/:id
router.get('/:id', checkAuth, EmployeesController.getEmployee)

// POST /employees
router.post('/', checkAuth, EmployeesController.editEmployee)

// PUT /employees
// This is for admin, only for development
router.put('/', EmployeesController.addEmployee)

module.exports = router
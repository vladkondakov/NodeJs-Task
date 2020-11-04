const router = require('express').Router()
const EmployeesController = require('../controllers/employees')
const { checkAuth } = require('../middleware/check-auth')
const { paginateEmployees } = require('../middleware/paginate-employees')
const { sortEmployeesBySalary } = require('../middleware/sort-employees')

// GET /employees
// Remove paginate and sort logics from middleware!!!
router.get('/', checkAuth, EmployeesController.getEmployees)

// GET /employees/:login
router.get('/:login', checkAuth, EmployeesController.getEmployee)

// POST /employees/:login
router.post('/:login', checkAuth, EmployeesController.editEmployee)

// PUT /employees/
// This is for admin, only for development
router.put('/', EmployeesController.addEmployee)

module.exports = router
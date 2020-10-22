const router = require('express').Router()
const EmployeesController = require('../controllers/employees')
const { checkAuth } = require('../middleware/check-auth')
const { paginateEmployees } = require('../middleware/paginate-employees')
const { sortEmployeesBySalary } = require('../middleware/sort-employees')

// GET /employees/:login
router.get('/:login', checkAuth, sortEmployeesBySalary, paginateEmployees, EmployeesController.getEmployees)

// GET /employees/:login/card
router.get('/:login/card', checkAuth, EmployeesController.getEmployee)

// POST /employees/:login/card
router.post('/:login/card', checkAuth, EmployeesController.editEmployee)

// PUT /employees/new-user
// This is for admin (create check for admin?)
router.put('/new-user', EmployeesController.addEmployee)

module.exports = router
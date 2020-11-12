const router = require('express').Router();
const EmployeesController = require('../controllers/employees');
const { checkAuth } = require('../middleware/check-auth');
const { employeeValidation } = require('../middleware/employee-validation');

// GET /employees
router.get('/', checkAuth, EmployeesController.getPageEmployees);

// GET /employees/:id
router.get('/:id', checkAuth, EmployeesController.getEmployee);

// POST /employees
//put
router.post('/:id', checkAuth, employeeValidation, EmployeesController.editEmployee);

// PUT /employees
// This is for admin, only for development
router.put('/', EmployeesController.addEmployee);

module.exports = router;
const router = require('express').Router();
const EmployeesController = require('../controllers/employees');
const { checkAuth } = require('../middleware/check-auth');
const { employeeValidation } = require('../middleware/employee-validation');

// GET /employees
router.get('/', checkAuth, EmployeesController.getPageEmployees);

// POST /employees
router.post('/', EmployeesController.addEmployee);

// GET /employees/:id
router.get('/:id', checkAuth, EmployeesController.getEmployee);

// PUT /employees/:id
router.put('/:id', checkAuth, employeeValidation, EmployeesController.editEmployee);

module.exports = router;
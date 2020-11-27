const Employee = require('../service/employee-service');
const bcrypt = require('bcryptjs');
const ApiError = require('../error/apierror');
const config = require('config');

const getPageEmployees = (req, res, next) => {
    const offset = +req.query.offset || config.get('offset');
    const limit = +req.query.limit || config.get('limit');
    const order = req.query.order;
    const { name, surname } = req.query;

    const filteredEmployees = Employee.getFilteredEmployees(name, surname);
    const sortedEmployees = Employee.getSortedEmployees(filteredEmployees, order);
    const pageEmployees = Employee.getPageEmployees(sortedEmployees, offset, limit);

    return res.json({ pageEmployees });
}

const getEmployee = (req, res, next) => {
    try {
        const employee = Employee.getById(req.params.id);
        return res.send(employee);
    } catch (e) {
        return next(e);
    }
}

const editEmployee = (req, res, next) => {
    const employee = req.body;
    const id = req.params.id;
    employee.id = id;

    try {
        Employee.update(employee);
        return res.redirect(`/employees/${id}`);
    } catch (e) {
        return next(ApiError.notFound(`Can't find and update employee: ${req.params.id}.`));
    }
}

// Only for development
const addEmployee = async (req, res, next) => {
    try {
        const { password, ...restProps } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const employee = { password: hashedPassword, ...restProps };
        employee.save();
        res.json({ message: "employee was successfully added." });
    } catch (e) {
        res.status(500).json({ message: "something is wrong in adding." });
    }
}

module.exports = {
    getPageEmployees,
    getEmployee,
    editEmployee,
    addEmployee
}

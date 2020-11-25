const Employee = require('../service/employee-service');
const bcrypt = require('bcryptjs');
const ApiError = require('../error/apierror');

const getPageEmployees = (req, res, next) => {
    const offset = parseInt(req.query.offset) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const order = req.query.order;
    const name = req.query.name || "";
    const surname = req.query.surname || "";

    try {
        const filteredEmployees = Employee.getFilteredEmployees(name, surname);
        const sortedEmployees = Employee.getSortedEmployees(filteredEmployees, order);
        const pageEmployees = Employee.getPageEmployees(sortedEmployees, offset, limit);
        res.json({ pageEmployees });
    } catch (e) {
        return next({ message: "Can't get employees" });
    }
}

const getEmployee = (req, res, next) => {
    const employee = Employee.getById(req.params.id);
    if (!employee) {
        return next(ApiError.notFound(`Can't find employee: ${req.params.id}`));
    }

    res.send(employee);
}

const editEmployee = (req, res, next) => {
    const employee = req.body;
    const id = req.params.id;

    employee.id = id;
    const isUpdated = Employee.update(employee);

    if (!isUpdated) {
        return next(ApiError.notFound(`Can't find and update employee: ${req.params.id}`));
    }

    res.redirect(`/employees/${id}`);
}

// Only for development
const addEmployee = async (req, res, next) => {
    try {
        const { password, ...restProps } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const employee = { password: hashedPassword, ...restProps };
        employee.save();
        res.json({ message: "employee was successfully added" });
    } catch (e) {
        res.status(500).json({ message: "something is wrong in adding" });
    }
}

module.exports = {
    getPageEmployees,
    getEmployee,
    editEmployee,
    addEmployee
}

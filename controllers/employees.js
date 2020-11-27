const Employee = require('../service/employee-service');
const bcrypt = require('bcryptjs');
const ApiError = require('../error/apierror');
const config = require('config');

const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const usersDatabase = lowDb(new FileSync('users.json'));

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

const addEmployee = async (req, res, next) => {
    try {
        const { password, ...restProps } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = {
            type: "user",
            id: restProps.id,
            password: hashedPassword
        };
        usersDatabase.get('users').push(user).write();

        const employee = req.body;
        employee.password = hashedPassword;
        Employee.save(employee);

        return res.status(201).send();
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    getPageEmployees,
    getEmployee,
    editEmployee,
    addEmployee
}

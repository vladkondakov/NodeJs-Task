const Employee = require('../service/employee-service');
const bcrypt = require('bcryptjs');
const ApiError = require('../error/apierror');

const getPageEmployees = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pagination = parseInt(req.query.pagination) || 25;
    const order = req.query.order;
    // const name = req.query.name;
    // const surname = req.query.surname;

    try {
        // const filteredEmployees = Employee.getFilteredEmployees(name, surname);
        const sortedEmployees = Employee.getSortedEmployees(order);
        const paginatedEmployees = Employee.getPaginatedEmployees(sortedEmployees, page, pagination);
        res.json({ paginatedEmployees });
    } catch (e) {
        return next({ message: "Something is wrong with getting paginated employees" })
    }
}

const getEmployee = (req, res, next) => {
    try {
        const employee = Employee.getByLogin(req.params.id);

        if (!employee) {
            return next(ApiError.notFound(`Can't find employee with id: ${req.params.id}`));
        }

        res.send(employee);
    } catch (e) {
        return next({ message: "Something is wrong with getting employee" });
    }
}

const editEmployee = (req, res, next) => {
    try {
        const employee = req.body;
        const id = req.params.id;

        employee.login = id;
        const info = Employee.update(employee);

        if (info.isUpdated === false) {
            return next(ApiError.notFound("Can't find and update employee"));
        }

        res.redirect(`/employees/${id}`);
    } catch (e) {
        return next({ message: "Something is wrong in editing employee" });
    }

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

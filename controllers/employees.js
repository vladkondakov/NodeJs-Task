const Employee = require('../service/employee-service')
const bcrypt = require('bcryptjs')
const { employeeSchema } = require('../helpers/validation-schema')

const getPageEmployees = (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 25
        const order = req.query.order

        const employees = Employee.getSortedEmployees(order)
        const paginatedEmployees = Employee.getPaginatedEmployees(employees, page, pagination)

        res.json({ paginatedEmployees })
    } catch (e) {
        res.status(500).json({ message: "something wrong in getting employees" })
    }
}

const getEmployee = (req, res) => {
    res.send(Employee.getByLogin(req.params.id))
}

const editEmployee = async (req, res) => {
    try {
        const employee = req.body
        const login = req.params.id
        
        const result = await employeeSchema.validateAsync(employee)
        
        employee.login = login
        Employee.update(employee)

        res.redirect(`/employees/${employee.login}`)
    } catch (e) {
        // res.status(422).json({message: "Validate Error"})
        res.send(e.message)
    }

}

const addEmployee = async (req, res) => {
    try {
        const { login, password, name, surname, dateOfBirth, position, salary } = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        const employee = new Employee(login, hashedPassword, name, surname, dateOfBirth, position, salary)
        employee.save()
        res.json({ message: "employee was successfully added" })
    } catch (e) {
        res.status(500).json({ message: "something wrong in adding" })
    }
}

module.exports = {
    getPageEmployees,
    getEmployee,
    editEmployee,
    addEmployee
}

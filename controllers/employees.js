const Employee = require('../service/employee-service')
const bcrypt = require('bcryptjs')

const getPageEmployees = (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 25
        const order = req.query.order

        const employees = Employee.getSortedEmployees(order)
        const paginatedEmployees = Employee.getPaginatedEmployees(employees, page, pagination)

        res.json({ paginatedEmployees })
    } catch (e) {
        res.status(500).json({ message: "Something wrong in getting employees" })
    }
}

const getEmployee = (req, res) => {
    try {
        res.send(Employee.getByLogin(req.params.id))
    } catch (e) {
        res.status(500).json({ message: "Something wrong in getting employee" })
    }
}

const editEmployee = async (req, res) => {
    try {
        const employee = req.body
        const id = req.params.id

        employee.login = id
        Employee.update(employee)

        res.redirect(`/employees/${id}`)
    } catch (e) {
        res.status(500).json({message: "Something wrong in editing employee"})
    }

}

// Only for development
const addEmployee = async (req, res) => {
    try {
        const { password, ...restProps } = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        const employee = new Employee({ password: hashedPassword, ...restProps })
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

const Employee = require('../models/employee')
const bcrypt = require('bcryptjs')

const getEmployees = (req, res) => {

    const page = parseInt(req.query.page)
    const pagination = parseInt(req.query.pagination)
    
    const startIndex = (page - 1) * pagination
    const endIndex = startIndex + pagination
    
    const employees = Employee.getAll()
    const results = {}

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            pagination
        }
    }

    if (endIndex < employees.length) {
        results.next = {
            page: page + 1,
            pagination
        }
    }

    results.pageEmployees = employees.slice(startIndex, endIndex)

    res.send(results)
}

const getEmployee = (req, res) => {
    const employee = Employee.getByLogin(req.params.login)
    res.send(employee)
}

const editEmployee = async (req, res) => {
    let employee = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    employee.password = hashedPassword
    Employee.update(employee)
    res.redirect('/employees/:login/card')
}

const addEmployee = async (req, res) => {
    try {
        const {login, password, name, surname, dateOfBirth, position, salary} = req.body    
        const hashedPassword = await bcrypt.hash(password, 12)
        const employee = new Employee(login, hashedPassword, name, surname, dateOfBirth, position, salary)
        employee.save()
        res.json({ message: "employee was successfully added" })
    } catch (e) {
        res.status(500).json({ message: "something wrong in adding" })
    } 
}

module.exports = {
    getEmployees,
    getEmployee,
    editEmployee,
    addEmployee
}

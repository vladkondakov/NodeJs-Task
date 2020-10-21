const Employee = require('../models/employee')
const bcrypt = require('bcryptjs')

const getAllEmployees = (req, res) => {
    const employees = Employee.getAll()
    res.send(employees)
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
    getAllEmployees,
    getEmployee,
    editEmployee,
    addEmployee
}

const Employee = require('../models/employee')
const bcrypt = require('bcryptjs')

// Rewrite with paginate and sort logic
const getEmployees = (req, res) => {
    // try {
    //     const page = req.params.page ? req.params.page : 1
    //     const pagination = req.params.pagination ? req.params.pagination : 25
        
    //     const employees = 
    // } catch (e) {
    //     res.status(500).json({ message: "something wrong in getting employees" })
    // }


    res.send(res.paginatedEmployees)
}

const getEmployee = (req, res) => {
    res.send(Employee.getByLogin(req.params.login))
}

const editEmployee = async (req, res) => {
    let employee = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    employee.password = hashedPassword
    Employee.update(employee)

    res.redirect(`/employees/${employee.login}`)

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

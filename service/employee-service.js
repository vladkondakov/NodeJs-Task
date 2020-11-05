const { date } = require('joi')
const lowDb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = lowDb(new FileSync('db.json'))

class Employee {

    constructor(employeeData) {
        if (employeeData.login && employeeData.password) {
            this.login = employeeData.login
            this.password = employeeData.password
        }

        this.name = employeeData.name
        this.surname = employeeData.surname
        this.dateOfBirth = employeeData.dateOfBirth
        this.position = employeeData.position
        this.salary = employeeData.salary
    }

    static getByLogin(login) {
        const employee = db.get('employees').find({ login: login }).value()
        const result = new Employee({
            name: employee.name,
            surname: employee.surname,
            dateOfBirth: employee.dateOfBirth,
            position: employee.position,
            salary: employee.salary
        })

        return result
    }

    static getByLoginAllInfo(login) {
        const employee = db.get('employees').find({ login: login }).value()
        return employee
    }

    static update(employee) {
        db.get('employees').find({ login: employee.login }).assign(employee).write()
    }

    toJSON() {
        return ({
            login: this.login,
            password: this.password,
            name: this.name,
            surname: this.surname,
            dateOfBirth: this.dateOfBirth,
            position: this.position,
            salary: this.salary
        })
    }

    save() {
        db.get('employees').push(this)
    }

    static getAllEmployees() {
        const employees = [...db.get('employees').value()]
        const results = employees.map(employee => new Employee({
            name: employee.name,
            surname: employee.surname,
            dateOfBirth: employee.dateOfBirth,
            position: employee.position,
            salary: employee.salary
        }));

        return results
    }

    // By salary
    static getSortedEmployees(order) {
        const ascFunction = (a, b) => +a.salary - +b.salary
        const descFunction = (a, b) => +b.salary - +a.salary

        const employees = Employee.getAllEmployees()
        // const employees = [...db.get('employees').value()]
        // const employees = Object.assign([], db.get('employees').value())

        if (order) {
            const compareFunction = (order === 'desc' ? descFunction : ascFunction)
            return employees.sort(compareFunction)
        }

        db.get('employees')

        return employees
    }

    static getPaginatedEmployees(employees, page, pagination) {
        let results = {}
        let startIndex = (page - 1) * pagination
        let endIndex = startIndex + pagination

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

        return results
    }

}

module.exports = Employee
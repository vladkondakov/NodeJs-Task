const lowDb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = lowDb(new FileSync('db.json'))

class Employee {
    constructor(login, password, name, surname, dateOfBirth, position, salary) {
        this.login = login
        this.password = password
        this.name = name
        this.surname = surname
        this.dateOfBirth = dateOfBirth
        this.position = position
        this.salary = salary
    }

    static getAll() {
        return db.get('employees').value()
    } 

    static getByLogin(login) {
        // const employees = Employee.getAll()
        const employees = db.get('employees').value()
        // return db.get('employees').find({ login: login })
        return employees.find(c => c.login === login)
    }

    static update(employee) {
        // const employees = db.get('employees').value()
        // const idx = employees.findIndex(c => c.login === employee.login)
        // employees[idx] = employee
        // db.set('employees', employees).write()
        db.get('employees').find({ login: employee.login }).assign(employee).write()
    }

    // Pay attention to password
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
        // const employees = Employee.getAll()
        // employees.push(this)
        // db.set('employees', employees).write()

        db.get('employees').push(this)
    }

}

module.exports = Employee
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

    // static getAll() {
    //     return db.get('employees').value()
    // } 

    static getByLogin(login) {
        const employees = db.get('employees').value()
        // return db.get('employees').find({ login: login })
        return employees.find(c => c.login === login)
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

    // By salary
    static getSortedEmployees(order) {
        const ascFunction = (a, b) => +a.salary - +b.salary
        
        const descFunction = (a, b) => +b.salary - +a.salary

        const employees = [... db.get('employees').value()]
        // const employees = Object.assign([], db.get('employees').value())
        
        if (order) {
            const compareFunction = (order === 'desc' ? descFunction : ascFunction)
            return employees.sort(compareFunction)
        }

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
const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('db.json'));
const ApiError = require('../error/apierror');
const { employeeMapper } = require('../helpers/employee-mapper')

class Employee {
    static getById(id) {
        const employee = db.get('employees').find({ id }).value();
        if (!employee) {
            throw ApiError.badRequest(`Can't find employee: ${id}.`);
        }
        return employeeMapper(employee);
    }

    static update(employee) {
        const res = this.getById(employee.id);
        db.get('employees').find({ id: employee.id }).assign(employee).write();
    }

    static getAllEmployees() {
        const employees = [...db.get('employees').value()];
        const results = employees.map(employee => employeeMapper(employee));
        return results;
    }

    // if name or surname are not defined we pass the empty strings
    static getFilteredEmployees(name, surname) {
        const employees = this.getAllEmployees();

        if (!name && !surname) {
            return employees;
        }
        
        const regName = new RegExp(name, 'i');
        const regSurname = new RegExp(surname, 'i')

        const filteredEmployees = employees.filter(employee => {
            const isNamesMatch = regName.test(employee.name);
            const isSurnamesMatch = regSurname.test(employee.surname);

            return (isNamesMatch && isSurnamesMatch);
        })
        
        return filteredEmployees;
    }

    // By salary   
    static getSortedEmployees(filteredEmployees, order) {
        const ascFunction = (a, b) => +a.salary - +b.salary;
        const descFunction = (a, b) => +b.salary - +a.salary;

        if (order) {
            const compareFunction = (order === 'desc' ? descFunction : ascFunction);
            return filteredEmployees.sort(compareFunction);
        }

        return filteredEmployees;
    }

    static getPageEmployees(employees, offset, limit) {
        let results = {};
        let startIndex = (offset - 1) * limit;
        let endIndex = startIndex + limit;

        if (startIndex > 0) {
            results.previous = {
                offset: offset - 1,
                limit
            };
        }

        if (endIndex < employees.length) {
            results.next = {
                offset: offset + 1,
                limit
            };
        }

        results.pageEmployees = employees.slice(startIndex, endIndex);
        return results;
    }

    static save(employee) {
        db.get('employees').push(employee).write();
    }

}

module.exports = Employee
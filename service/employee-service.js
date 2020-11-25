const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('db.json'));

const { employeeMapper } = require('../helpers/employee-mapper')

class Employee {
    static getById(id) {
        const employee = db.get('employees').find({ id }).value()
        const res = employee ? employeeMapper(employee) : employee;
        return res
    }

    static getByIdAllInfo(id) {
        const employee = db.get('employees').find({ id }).value();
        return employee;
    }

    static update(employee) {
        const res = this.getById(employee.id);
        let isUpdated = false;

        if (res) {
            db.get('employees').find({ id: employee.id }).assign(employee).write();
            return !isUpdated
        }
        return isUpdated;
    }

    static getAllEmployees() {
        const employees = [...db.get('employees').value()];
        const results = employees.map(employee => employeeMapper(employee));
        return results;
    }

    static getFilteredEmployees(name, surname) {
        const employees = this.getAllEmployees();

        if (!name && !surname) {
            return employees;
        }

        const filteredEmployees = employees.filter(employee => {
            const isNamesEquals = employee.name.toLowerCase() === name.toLowerCase();
            const isSurnamesEquals = employee.surname.toLowerCase() === surname.toLowerCase();

            if (name) {
                if (surname) {
                    return isNamesEquals && isSurnamesEquals;
                }

                return isNamesEquals;
            } else if (surname) {
                return isSurnamesEquals;
            }
        });

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

    save() {
        db.get('employees').push(this)
    }

}

module.exports = Employee
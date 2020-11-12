const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('db.json'));

class Employee {
    //объединить
    static getByLogin(login) {
        const employee = db.get('employees').find({ login }).value()

        if (employee) {
            const result = {
                name: employee.name,
                surname: employee.surname,
                dateOfBirth: employee.dateOfBirth,
                position: employee.position,
                salary: employee.salary
            };
            return result;
        }
        return employee;
    }

    static getByLoginAllInfo(login) {
        const employee = db.get('employees').find({ login }).value();
        return employee;
    }

    static update(employee) {
        const res = this.getByLogin(employee.login);
        if (!res) {
            return { isUpdated: false };
        }

        db.get('employees').find({ login: employee.login }).assign(employee).write();
        return { isUpdated: true };
    }

    static getAllEmployees() {
        const employees = [...db.get('employees').value()];
        const results = employees.map(employee => ({
            name: employee.name,
            surname: employee.surname,
            dateOfBirth: employee.dateOfBirth,
            position: employee.position,
            salary: employee.salary
        }));

        return results;
    }

    static getFilteredEmployees(name, surname) {
        const employees = this.getAllEmployees();

        if (!name && !surname) {
            return employees;
        }

        const filteredEmployees = employees.filter(employee => {
            const isNamesEquals = employee.name === name;
            const isSurnamesEquals = employee.surname === surname;

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
    static getSortedEmployees(order) {
        const ascFunction = (a, b) => +a.salary - +b.salary;
        const descFunction = (a, b) => +b.salary - +a.salary;

        const employees = this.getAllEmployees();
        // const employees = [...db.get('employees').value()]
        // const employees = Object.assign([], db.get('employees').value())

        if (order) {
            const compareFunction = (order === 'desc' ? descFunction : ascFunction);
            return employees.sort(compareFunction);
        }
        return employees;
    }

    //rename pagination
    static getPaginatedEmployees(employees, page, pagination) {
        let results = {};
        let startIndex = (page - 1) * pagination;
        let endIndex = startIndex + pagination;

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                pagination
            };
        }

        if (endIndex < employees.length) {
            results.next = {
                page: page + 1,
                pagination
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
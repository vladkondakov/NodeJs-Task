const Employee = require('../models/employee')

exports.sortEmployeesBySalary = (req, res, next) => {
    // desc -> Descending; asc -> Ascending
    if(req.query.orderBy) {
        let employees = Employee.getAll()
        const orderBy = req.query.orderBy

        const compareFunction = (orderBy === 'desc' ? descFunction : ascFunction)
        employees.sort(compareFunction)
        
        res.sortedEmployees = employees
    }

    next()
}

const ascFunction = (a, b) => {
    return +a.salary - +b.salary
}

const descFunction = (a, b) => {
    return +b.salary - +a.salary
}

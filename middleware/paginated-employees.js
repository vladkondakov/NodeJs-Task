const Employee = require('../models/employee')

exports.paginatedEmployees = (req, res, next) => {
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
    res.paginatedEmployees = results
    next()
}


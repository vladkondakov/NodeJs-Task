exports.paginateEmployees = (req, res, next) => {
    
    const employees = res.sortedEmployees
    let startIndex = 0
    let endIndex = employees.length

    const results = {}
    
    if (req.query.page && req.query.pagination) {
        const page = parseInt(req.query.page)
        const pagination = parseInt(req.query.pagination)

        startIndex = (page - 1) * pagination
        endIndex = startIndex + pagination

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
    }

    results.pageEmployees = employees.slice(startIndex, endIndex)
    res.paginatedEmployees = results
    next()
}


const employeeMapper = (employee) => {
    const mappedEmployee = {
        name: employee.name,
        surname: employee.surname,
        dateOfBirth: employee.dateOfBirth,
        position: employee.position,
        salary: employee.salary
    };
    
    return mappedEmployee;
}

module.exports = {
    employeeMapper
}
const { employeeSchema } = require('../helpers/validation-schema');

//Общий мидлвар для валидации

exports.employeeValidation = async function(req, res, next) {
    const employee = req.body;
    await employeeSchema.validateAsync(employee).then(() => {
        return next();
    })
    .catch((e) => {
        return res.status(400).json({ 
            message: "Validation Error", 
            errorMessage: e.message });
    }) 
}


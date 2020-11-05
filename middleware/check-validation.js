const { employeeSchema } = require('../helpers/validation-schema')

exports.checkValidation = async function(req, res, next) {
    const employee = req.body
    await employeeSchema.validateAsync(employee).then(() => {
        return next()
    })
    .catch((e) => {
        return res.status(422).json({ 
            message: "Validation Error", 
            errorMessage: e.message })
    }) 
}


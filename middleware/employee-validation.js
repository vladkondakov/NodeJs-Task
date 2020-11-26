const { employeeSchema } = require('../helpers/validation-schema');
const ApiError = require("../error/apierror");

exports.employeeValidation = async function (req, res, next) {
    const employee = req.body;
    await employeeSchema.validateAsync(employee)
        .then(() => {
            return next();
        })
        .catch((e) => {
            const err = ApiError.badRequest(`Validation Error: ${e.message}`);
            return next(err);
        });
}


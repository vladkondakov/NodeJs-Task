const { authSchema } = require('../helpers/validation-schema');
const ApiError = require('../error/apierror');

exports.authValidation = async function (req, res, next) {
    const authData = req.body;
    await authSchema.validateAsync(authData)
        .then(() => {
            return next();
        })
        .catch((e) => {
            const err = ApiError.badRequest(`Something wrong with login or password: ${e.message}.`);
            return next(err);
        });

}

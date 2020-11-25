const ApiError = require("./apierror");

function apiErrorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).send(err.payload);
    }

    return res.status(500).json({ 
        statusCode: '500',
        message: err.message 
    });
}

module.exports = apiErrorHandler;


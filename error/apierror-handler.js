const ApiError = require("./apierror");

function apiErrorHandler(err, req, res, next) { 
    if (err instanceof ApiError) {
        return res.status(err.code).json({message: err.message});
        // return;
    }

    return res.status(500).json({ message: err.message });
}

module.exports = apiErrorHandler;
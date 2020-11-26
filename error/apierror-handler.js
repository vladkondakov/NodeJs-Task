const ApiError = require("./apierror");

function apiErrorHandler(err, req, res, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }

    console.error(`
===== Error =====
[ROUTE]
${req.method} ${req.originalUrl}
[MESSAGE]
${err.message || err.payload.message} 
[STACK]
${err.stack}
====== End ======
    `);

    if (!(err instanceof ApiError)) {
        return res.status(500).json({ 
            statusCode: '500',
            message: err.message 
        });
    }
    
    if (err.shouldRedirect) {
        return res.status(err.statusCode).send(err.message) 
    } 

    return res.status(err.statusCode).send(err.payload);
}

module.exports = apiErrorHandler;


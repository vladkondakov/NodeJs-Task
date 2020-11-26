const router = require('express').Router();
const ApiError = require("../error/apierror");

router.get('', (req, res, next) => {
    const err = ApiError.notFound(`${req.ip} tried to get page which doesn't exist`);
    err.shouldRedirect = true;

    return next(err);
});

module.exports = router;
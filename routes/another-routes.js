const router = require('express').Router();

router.get('', (req, res, next) => {
    const err = new Error(`${req.ip} tried to get page which doesn't exist`);
    err.statusCode = 404;
    err.shouldRedirect = true;

    return next(err);
});

module.exports = router;
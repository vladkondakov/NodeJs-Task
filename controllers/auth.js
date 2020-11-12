const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const Employee = require('../service/employee-service');
const ApiError = require('../error/apierror');

const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('rdb.json'));

const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.unprocessableEntity("Login and password are required"));
        }

        const { login, password } = req.body;
        const employee = Employee.getByLoginAllInfo(login);

        if (!employee || !(await bcrypt.compare(password, employee.password))) {
            return next(ApiError.notFound("Wrong login or password"));
        }

        const token = jwt.sign(
            { login },
            config.get('jwtSecret'),
            { expiresIn: config.get('tokenTime') }
        );

        const refreshToken = jwt.sign(
            { login },
            config.get('jwtSecretRefresh'),
            { expiresIn: config.get('refreshTokenTime') }
        );

        db.get('refreshTokens').push(refreshToken).write();
        
        res.json({
            status: "Logged in",
            token,
            refreshToken
        });

    } catch (e) {
        return next({ message: "Something is wrong, try again" });
    }
}

const generateNewToken = (req, res, next) => {
    try {
        const refreshToken = req.body.token;

        if (!refreshToken) {
            return next(ApiError.badRequest("Refresh Token hasn't been given"));
        }

        let refreshTokens = db.get('refreshTokens').value();

        if (!refreshTokens.includes(refreshToken)) {
            return next(ApiError.badRequest("Refresh token doesn't exist"));
        }

        jwt.verify(refreshToken, config.jwtSecretRefresh, (err, login) => {
            if (err) {
                return next(ApiError.forbidden("Can't verify refresh token"));
            }

            const token = jwt.sign(
                { login },
                config.get('jwtSecret'),
                { expiresIn: config.get('tokenTime') }
            );

            res.json({ token });
        });
    } catch (e) {
        return next({ message: "Something is wrong. Please, login again" })
    }
}

const logout = (req, res) => {

    db.get('refreshTokens').pull(req.body.token).write();
    res.json({ status: "Logged out" });
}

module.exports = {
    login,
    generateNewToken,
    logout
}
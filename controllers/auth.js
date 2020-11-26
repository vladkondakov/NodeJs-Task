const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Employee = require('../service/employee-service');
const ApiError = require('../error/apierror');

const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('rdb.json'));

const login = async (req, res, next) => {
    const { login, password } = req.body;
    const employee = Employee.getByIdAllInfo(login);

    if (!employee || !(await bcrypt.compare(password, employee.password))) {
        return next(ApiError.notFound("Employee was not found"));
    }

    const accessToken = jwt.sign(
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
        accessToken,
        refreshToken
    });
}

const generateNewToken = (req, res, next) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return next(ApiError.badRequest("Refresh Token hasn't been given"));
    }

    const refreshTokens = db.get('refreshTokens').value();

    if (!refreshTokens.includes(refreshToken)) {
        return next(ApiError.badRequest("Refresh token doesn't exist"));
    }

    jwt.verify(refreshToken, config.jwtSecretRefresh, (err, login) => {
        if (err) {
            return next(ApiError.forbidden("Can't verify refresh token"));
        }

        const accessToken = jwt.sign(
            { login },
            config.get('jwtSecret'),
            { expiresIn: config.get('tokenTime') }
        );

        res.json({ accessToken });
    });
}

const logout = (req, res) => {

    db.get('refreshTokens').pull(req.body.refreshToken).write();
    res.json({ status: "Logged out" });
}

module.exports = {
    login,
    generateNewToken,
    logout
}
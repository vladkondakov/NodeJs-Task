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
        return next(ApiError.notFound("The employee was not found."));
    }

    const user = { login };
    const accessToken = generateAccessToken(user);

    const refreshToken = jwt.sign(
        user,
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
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return next(ApiError.unauthorized("The refresh Token hasn't been given."));
    }

    const refreshTokens = db.get('refreshTokens').value();

    if (!refreshTokens.includes(refreshToken)) {
        return next(ApiError.forbidden("The refresh token provided doesn't exist."));
    }

    jwt.verify(refreshToken, config.jwtSecretRefresh, (err, user) => {
        if (err) {
            return next(ApiError.forbidden("Can't verify the refresh token."));
        }

        const accessToken = generateAccessToken({ user: user.login });
        res.json({ accessToken });
    });
}

const logout = (req, res) => {
    db.get('refreshTokens').pull(req.body.refreshToken).write();
    res.sendStatus(204);
}

const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        user,
        config.get('jwtSecret'),
        { expiresIn: config.get('tokenTime') }
    );

    return accessToken;
}

module.exports = {
    login,
    generateNewToken,
    logout
}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const ApiError = require('../error/apierror');

const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb(new FileSync('rdb.json'));
const usersDatabase = lowDb(new FileSync('users.json'));

// db for users
const login = async (req, res, next) => {
    const { login, password } = req.body;
    const user = usersDatabase.get('users').find({ id: login }).value();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(ApiError.badRequest("Login or password are wrong."));
    }

    const accessToken = generateAccessToken({ userName: login });

    const refreshToken = jwt.sign(
        { userName: login },
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
        const accessToken = generateAccessToken(user);

        res.json({ accessToken });
    });
}

const logout = (req, res) => {
    db.get('refreshTokens').pull(req.body.refreshToken).write();
    res.sendStatus(204);
}

const generateAccessToken = (payload) => {
    const accessToken = jwt.sign(
        {userName: payload.userName},
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
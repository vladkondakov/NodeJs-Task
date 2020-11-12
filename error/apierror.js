//extends Error

class ApiError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    static badRequest(msg) {
        return new ApiError(400, msg);
    }

    static unauthorized(msg) {
        return new ApiError(401, msg);
    }

    static forbidden(msg) {
        return new ApiError(403, msg);
    }

    static notFound(msg) {
        return new ApiError(404, msg);
    }

    static conflict(msg) {
        return new ApiError(409, msg);
    }

    static unprocessableEntity(msg) {
        return new ApiError(422, msg);
    }
}

module.exports = ApiError;
const formPayload = (statusCode, errType, message) => {
    return {
        "statusCode": statusCode,
        errType,
        message
    }
};

class ApiError extends Error {
    constructor(statusCode, payload) {
        super();
        this.statusCode = statusCode;
        this.payload = payload;
    }

    static badRequest(msg) {
        const payload = formPayload(400, "Bad Request", msg);
        return new ApiError(400, payload);
    }

    static unauthorized(msg) {
        const payload = formPayload(401, "Unauthorized", msg)
        return new ApiError(401, payload);
    }

    static forbidden(msg) {
        const payload = formPayload(403, "Forbidden", msg)
        return new ApiError(403, payload);
    }

    static notFound(msg) {
        const payload = formPayload(404, "Not Found", msg)
        return new ApiError(404, payload);
    }

    setNewMessage(msg) {
        this.payload.message = msg;
    }

    // static conflict(msg) {
    //     return new ApiError(409, msg);
    // }
}

module.exports = ApiError;
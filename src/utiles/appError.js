class AppError extends Error {
    constructor(e, msg, code) {

        super(msg);
        this.e = e;
        this.msg = msg;
        this.statusCode = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

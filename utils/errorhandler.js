//Error handler class
class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        this.stautsCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
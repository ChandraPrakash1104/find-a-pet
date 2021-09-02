class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCose = statusCode;
    }
}

module.exports = ExpressError;
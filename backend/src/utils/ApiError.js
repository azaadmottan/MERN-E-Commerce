class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!",
        errors = [],
        data = null,
        stack = "",
    ) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = data;
        this.success = false; // Default to false

        // Capture stack trace if not provided
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Utility method to format the error response for logging or sending to clients
    format() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
            data: this.data,
            success: this.success,
            stack: process.env.NODE_ENV === 'development' ? this.stack : undefined // include stack trace only in development mode
        };
    }

    // Utility method to add more details to errors
    addErrorDetail(errorDetail) {
        this.errors.push(errorDetail);
    }

    // Static method to create error from an existing error
    static from(error, statusCode = 500) {
        return new ApiError(
            statusCode,
            error.message,
            error.errors || [],
            error.data || null,
            error.stack || ""
        );
    }

    // Other static error creation methods (e.g., badRequest, unauthorized, etc.)
    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized", errors = []) {
        return new ApiError(401, message, errors);
    }

    static forbidden(message = "Forbidden", errors = []) {
        return new ApiError(403, message, errors);
    }

    static notFound(message = "Not Found", errors = []) {
        return new ApiError(404, message, errors);
    }

    static internalServerError(message = "Internal Server Error", errors = []) {
        return new ApiError(500, message, errors);
    }
}

export { ApiError };
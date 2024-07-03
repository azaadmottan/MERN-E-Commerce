class ApiResponse {
    constructor(
        statusCode, 
        data = null, 
        message = "Success",
        success = true  // Default to true for success responses
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 500;
    }

    // Utility method to create a success response
    static success(data = null, message = "Success", statusCode = 200) {
        return new ApiResponse(statusCode, data, message);
    }

    // Utility method to create an error response
    static error(message = "Error", statusCode = 500, data = null) {
        return new ApiResponse(statusCode, data, message);
    }

    // Utility method to format the response for sending to the client
    format() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            success: this.success
        };
    }
}

export { ApiResponse };
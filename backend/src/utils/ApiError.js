class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong!",
        error=[],

    ){
        super(message);
        this.statusCode = statusCode,
        this.error = error;
        this.message = message
    }
}

export default ApiError;
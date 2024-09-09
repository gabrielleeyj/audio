exports.errorHandler = (err, req, res, next) => {
    // Default status code is 500 (internal server error)
    const statusCode = err.status || 500;

    // Logging the error 
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    let response = {
        error: {
            message: err.message || 'Internal Server Error'
        }
    };

    // Use a switch statement to handle different error cases
    switch (statusCode) {
        case 400:
            response.error.message = err.message || 'Bad Request';
            response.error.details = err.details || null;  
            break;
        case 401:
            response.error.message = 'Unauthorized: Access is denied due to invalid credentials.';
            break;
        case 403:
            response.error.message = 'Forbidden: You do not have the necessary permissions.';
            break;
        case 404:
            response.error.message = 'Resource not found';
            break;
        case 413:
            response.error.message = 'File too large. The maximum allowed size is 2MB.';
            break;
        case 422:
            response.error.message = 'Validation failed';
            response.error.details = err.details || null;  // Provide additional validation error details if available
            break;
        case 500:
        default:
            response.error.message = err.message || 'Internal Server Error';
            break;
    }

    // Send the response with the corresponding status code
    res.status(statusCode).json(response);
};


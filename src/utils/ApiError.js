class ApiError extends Error {
  constructor(
    statusCode,
    message = "An error occurred", // Default message
    errors = [], // Default error array)
    stack = "" // Default stack trace
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates if the error is operational
    this.message = message; // Error message
    this.errors = errors; // Array of errors
    this.status = false; // Indicates if the error is a failure
    if (stack) {
      this.stack = stack; // Stack trace
    } else {
      Error.captureStackTrace(this, this.constructor); // Captures the stack trace
    }
  }
}

export default ApiError;

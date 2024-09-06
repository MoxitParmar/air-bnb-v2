// Define a class called apiError that extends the built-in Error class
class apiError extends Error {
  constructor(
    status,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super();

    // Set properties of the apiError instance
    this.status = status;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    // If a stack trace is provided, set it as the stack property of the instance
    // Otherwise, capture the stack trace using Error.captureStackTrace()
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the apiError class as a named export
export { apiError };

// This function wraps an async request handler with error handling
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    // Wrap the request handler in a Promise to handle async operations
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // Catch any errors and pass them to the next middleware
  };
};

export { asyncHandler };

const AsyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default AsyncHandler;
// This function is an async handler that takes a function as an argument and returns a new function. The new function calls the original function and catches any errors that occur during its execution. If an error occurs, it passes the error to the next middleware in the Express.js application using the next() function. This is useful for handling errors in asynchronous code in Express.js applications.

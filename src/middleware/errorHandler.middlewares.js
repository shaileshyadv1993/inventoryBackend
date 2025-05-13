import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  console.log("I am here in errorHandler");
  // Handle Mongoose Duplicate Key Error (code: 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = new ApiError(
      409,
      `Duplicate value for field "${field}": "${value}"`
    );
  }

  // Handle Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, "Validation Error", messages);
  }

  // Generic fallback for unhandled errors
  if (!(error instanceof ApiError)) {
    const statusCode =
      err.statusCode || err instanceof mongoose.Error ? 400 : 500;
    const message = err.message || "Something went wrong";
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  // Response structure
  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };

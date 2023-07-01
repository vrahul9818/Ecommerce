const ErrorHandler = require("../utils/errorHandlers");

module.exports = (err, req, res, next) => {
  console.log(err.message);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  if (err.name === "CastError") {
    const message = "Resource Not Found";
    err = new ErrorHandler(message, 400);
  }

//   Mongoose duplicate key error
  if (err.code === 11000) {
    console.log(Object.keys)
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid Json Web Token. Please try again.";
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token has expired. Please try again.";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

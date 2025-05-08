function errorHandler(err, req, res, next) {
  const statusCode = err.status || res.statusCode || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  console.error(err);

  res.status(statusCode).json({
    isSuccess: false,
    statusCode: statusCode,
    message: isClientError ? err.message : statusCode == 500 ? "Internel server error" : "Something went wrong",
    ...(process.env.PROJECT_MODE === "production" ? {} : { stack: err.stack }),
  });
}

module.exports = errorHandler;
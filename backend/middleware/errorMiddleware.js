const notFound = (req, res, next) => {
  const error = new Error(`Resource not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message;
  if (error.name === "CastError" && error.kind === "ObjectId") {
    message = "Resource not Found";
    statusCode = 404;
  }
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_DEV === "development" ? error.stack : null,
  });
};

export { notFound, errorHandler };

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map(val => val.message);
    message = messages.join(', ');
  }
  

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
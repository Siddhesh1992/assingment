class AppError extends Error {
  constructor(message, statusCode, data) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Alert' : 'Error';
    this.isOperational = true;
    this.data = data || {};

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

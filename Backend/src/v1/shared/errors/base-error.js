class BaseError extends Error {
  constructor({
    message,
    statusCode = 500,
    isOperational = false,
  }) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export { BaseError }
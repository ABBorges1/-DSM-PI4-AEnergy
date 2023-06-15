import { BaseError } from './base-error'

export class NotImplementedError extends BaseError {
  constructor(className, method) {
    super({
      message: `${className}#${method} não foi implementado.`,
      statusCode: 500,
      isOperational: false,
    })

    this.method = method
    this.className = className

    Error.captureStackTrace(this, this.constructor)
  }
}
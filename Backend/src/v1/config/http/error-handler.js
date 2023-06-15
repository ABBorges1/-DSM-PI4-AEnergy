import { BaseError } from '../../shared/errors/base-error'

/**
 *
 * @param {BaseError} error
 * @param {*} reply
 * @returns
 */
export function hapiErrorHandler(error, reply) {
  console.error(error)

  const statusCode = error?.statusCode || 500
  if (error?.isOperational) {
    return reply
      .response({
        statusCode,
        error: error.name,
        message: error.message,
      })
      .code(statusCode)
  }

  return reply.response({
    statusCode,
    error: 'Internal Server Error',
    message: error.message,
  }).code(statusCode)
}

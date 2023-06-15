import { BaseError } from './base-error'

export class InvalidParamError extends BaseError {
  constructor(param, details = '') {
    super({
      message: `Parâmetro inválido: ${param}.` + (details ? ` ${details}` : ''),
      isOperational: true,
      statusCode: 400,
    })
  }
}

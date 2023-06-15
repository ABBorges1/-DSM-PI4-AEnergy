import { BaseError } from '../../../shared/errors/base-error'

class EntityNotFoundError extends BaseError {
  constructor(entityName) {
    super({
      message: `A entidade (${entityName}) não foi encontrada.`,
      statusCode: 404,
      isOperational: true,
    })
  }
}

export { EntityNotFoundError }

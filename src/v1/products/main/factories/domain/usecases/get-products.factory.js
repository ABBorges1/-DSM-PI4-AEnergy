import { GetUserProducts } from '../../../../domain/usecases'
import { SequelizeProductRepository } from '../../../../infra/repositories/sequelize-product-repository'

export function makeGetUserProducts() {
  return new GetUserProducts({
    productRepository: new SequelizeProductRepository(),
  })
}

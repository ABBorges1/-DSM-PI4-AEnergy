import { faker } from '@faker-js/faker'
import { Product } from '../../../src/v1/products/domain/entities/product.entity'

export function mockProduct(modification = {}) {
  return Product.create({
    name: faker.name.firstName(),
    userId: faker.datatype.number(),
    uuid: faker.datatype.uuid(),
    ...modification,
  })
}

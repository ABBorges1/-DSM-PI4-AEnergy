import { ProductRepository } from '../protocols/repositores/product.repository'

export class GetUserProducts {
  #productRepository

  constructor({ productRepository = new ProductRepository() }) {
    this.#productRepository = productRepository
  }

  async execute({ userId }) {
    return this.#productRepository.findUserProducts({ userId })
  }
}

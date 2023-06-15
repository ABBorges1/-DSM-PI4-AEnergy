import { NotImplementedError } from '../../../../shared/errors/not-implemented-error'
import { Consumption } from '../../entities/consumption.entity'
import { Product } from '../../entities/product.entity'

export class ProductRepository {
  /**
   *
   * @param {string} id
   * @returns {Promise<Product>}
   */
  async findById(id) {
    throw new NotImplementedError(this.constructor.name, this.findById.name)
  }

  /**
   * @param {{userId: string}} params
   * @returns {Promise<Product[]>}
   */
  async findUserProducts(params) {
    throw new NotImplementedError(
      this.constructor.name,
      this.findUserProducts.name
    )
  }

  /**
   *
   * @param {Consumption} consumption
   */
  async registerConsumption(consumption) {
    throw NotImplementedError(
      this.constructor.name,
      this.registerConsumption.name
    )
  }

  /**
   *
   * @returns {Promise<Consumption[]>}
   */
  async getLast30MinConsumptions({ productId }) {
    throw NotImplementedError(
      this.constructor.name,
      this.getLast30MinConsumptions.name
    )
  }

  /**
   *
   * @returns {Promise<
   * [{
   *  kw: number,
   *  hour: number
   * }]
   * >}
   */
  async getDayConsumptions({ date, productId }) {
    throw new NotImplementedError(
      this.constructor.name,
      this.getDayConsumptions.name
    )
  }

  /**
   *
   * @returns {Promise<
   * [{
   *  kw: number,
   *  dayOfMonth: number,
   * }]
   * >}
   */
  async getMonthConsumptions({ date, productId }) {
    throw new NotImplementedError(
      this.constructor.name,
      this.getMonthConsumptions.name
    )
  }
}

import { DistributorGateway } from '../protocols/gateways/distributor.gateway'
import { ProductRepository } from '../protocols/repositores/product.repository'

export class GetLastHalfHourConsumptions {
  constructor({
    productRepository = new ProductRepository(),
    distributorGateway = new DistributorGateway(),
  }) {
    this.productRepository = productRepository
    this.distributorGateway = distributorGateway
  }

  async execute({ productId, distributorId }) {
    const price = await this.distributorGateway.getKwmDistributorPrice(
      distributorId,
      new Date()
    )
    const lastHourConsumptions =
      await this.productRepository.getLast30MinConsumptions({ productId })

    return lastHourConsumptions.map(con => {
      return {
        ...con,
        kwm: con.kwm,
        kwInMoney: con.kwm * price,
      }
    })
  }
}

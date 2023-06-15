import { DistributorGateway } from '../protocols/gateways/distributor.gateway'
import { ProductRepository } from '../protocols/repositores/product.repository'

export class GetDailyProductConsumptions {
  constructor({
    productRepository = new ProductRepository(),
    distributorGateway = new DistributorGateway(),
  }) {
    this.productRepository = productRepository
    this.distributorGateway = distributorGateway
  }

  async execute({ date, productId, distributorId }) {
    const price = await this.distributorGateway.getKwmDistributorPrice(
      distributorId,
      date
    )

    const consumptionsByHour = await this.productRepository.getDayConsumptions({
      date,
      productId,
    })

    const consumptions = {
      consumptionsInKw: [],
      consumptionsInMoney: []
    }

    for (let hour = 0; hour < 24; hour++) {
      const consumption = consumptionsByHour.find(c => c.hour === hour)
      const consumptionInKw = consumption?.kw || 0
      const consumptionInMoney = consumptionInKw * price

      consumptions.consumptionsInKw.push(consumptionInKw)
      consumptions.consumptionsInMoney.push(consumptionInMoney)
    }

    return consumptions 
  }
}

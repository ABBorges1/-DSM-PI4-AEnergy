import { DistributorGateway } from '../protocols/gateways/distributor.gateway'
import { ProductRepository } from '../protocols/repositores/product.repository'

export class GetMonthlyProductConsumption {
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

    const daysOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate()

    const consumptions = {
      consumptionsInKw: [],
      consumptionsInMoney: [],
    }
    const monthlyConsumption =
      await this.productRepository.getMonthConsumptions({date, productId})

    for (let i = 0; i < daysOfMonth; i++) {
      const day = i + 1
      const consumption = monthlyConsumption.find(
        ({ dayOfMonth }) => dayOfMonth === day
      )

      const consumptionInKw = consumption?.kw || 0
      const consumptionInMoney = consumptionInKw * price

      consumptions.consumptionsInKw.push(consumptionInKw)
      consumptions.consumptionsInMoney.push(consumptionInMoney)
    }

    return consumptions
  }
}

import { Consumption } from '../entities/consumption.entity'
import { EntityNotFoundError } from '../errors/entity-not-found-error'
import { DistributorGateway } from '../protocols/gateways/distributor.gateway'
import { ProductPubSubGateway } from '../protocols/gateways/product-pubsub.gateway'
import { ProductRepository } from '../protocols/repositores/product.repository'

export class RegisterConsumption {
  constructor({
    productRepository = new ProductRepository(),
    productPubSub = new ProductPubSubGateway(),
    distributorGateway = new DistributorGateway(),
  }) {
    this.productRepository = productRepository
    this.productPubSub = productPubSub
    this.distributorGateway = distributorGateway
  }

  async execute({ eletricCurrent, power, productId, distributorId }) {
    const now = new Date()
    console.log('RegisterConsumption[execute]', `called with: `, {
      eletricCurrent,
      productId,
      power,
    })
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new EntityNotFoundError('Produto')
    }

    const consumption = Consumption.create({
      eletricCurrent,
      power,
      kwmDate: now,
      productId,
    })

    const { id } = await this.productRepository.registerConsumption(consumption)
    consumption.id = id

    const price = await this.distributorGateway.getKwmDistributorPrice(
      distributorId,
      now
    )
    await this.productPubSub.publishConsumption(productId, {
      ...consumption,
      kwm: consumption.kwm,
      kwmInMoney: consumption.kwm * price,
    })
    return consumption
  }
}

import { RegisterConsumption } from '../../../../domain/usecases/register-consumption'
import { MockedDistributorGateway } from '../../../../infra/gateways/mocked-distributor.gateway'
import { ProductPubSubEventEmitter } from '../../../../infra/gateways/product-pubsub.gateway'
import { SequelizeProductRepository } from '../../../../infra/repositories/sequelize-product-repository'

export function makeRegisterConsumption() {
  return new RegisterConsumption({
    productRepository: new SequelizeProductRepository(),
    productPubSub: ProductPubSubEventEmitter.create(),
    distributorGateway: new MockedDistributorGateway()
  })
}

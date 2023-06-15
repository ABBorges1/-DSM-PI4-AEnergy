import { GetLastHalfHourConsumptions } from '../../../../domain/usecases/get-last-half-hour-consumptions'
import { MockedDistributorGateway } from '../../../../infra/gateways/mocked-distributor.gateway'
import { SequelizeProductRepository } from '../../../../infra/repositories/sequelize-product-repository'

export function makeGetLastHalfHourConsumptions() {
  return new GetLastHalfHourConsumptions({
    productRepository: new SequelizeProductRepository(),
    distributorGateway: new MockedDistributorGateway(),
  })
}

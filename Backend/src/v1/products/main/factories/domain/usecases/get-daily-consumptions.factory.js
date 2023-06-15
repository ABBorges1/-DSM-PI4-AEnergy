import { GetDailyProductConsumptions } from '../../../../domain/usecases/get-daily-product-consumptions'
import { MockedDistributorGateway } from '../../../../infra/gateways/mocked-distributor.gateway'
import { SequelizeProductRepository } from '../../../../infra/repositories/sequelize-product-repository'

export function makeGetDailyConsumptions() {
  return new GetDailyProductConsumptions({
    productRepository: new SequelizeProductRepository(),
    distributorGateway: new MockedDistributorGateway()
  })
}

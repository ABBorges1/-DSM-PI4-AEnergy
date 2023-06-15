import { GetMonthlyProductConsumption } from '../../../../domain/usecases/get-monthly-product-consumption'
import { MockedDistributorGateway } from '../../../../infra/gateways/mocked-distributor.gateway'
import { SequelizeProductRepository } from '../../../../infra/repositories/sequelize-product-repository'

export function makeGetMonthlyProductConsumptions() {
  return new GetMonthlyProductConsumption({
    productRepository: new SequelizeProductRepository(),
    distributorGateway: new MockedDistributorGateway()
  })
}

import { env } from '../../../config/env'
import { DistributorGateway } from '../../domain/protocols/gateways/distributor.gateway'

export class MockedDistributorGateway extends DistributorGateway {
  async getKwmDistributorPrice() {
    return env.MOCKED_KWM_PRICE
  }
}

import { ProductPubSubEventEmitter } from '../../../../../src/v1/products/infra/gateways/product-pubsub.gateway'
import { faker } from '@faker-js/faker'
import { mockConsumption } from '../../../__mocks__/consumption.mock'
import { describe, test, beforeEach, expect } from 'vitest'

describe('ProductPubSubEventEmitter', () => {
  /**
   * @type {ProductPubSubEventEmitter}
   */
  let sut

  beforeEach(() => {
    sut = new ProductPubSubEventEmitter()
  })

  test('should publish an consumption to all listeners', async () => {
    const mockedProductId = faker.datatype.uuid()
    const otherMockedProductId = faker.datatype.uuid()
    const mockedConsumption = mockConsumption()
    sut.listenToConsumptions(mockedProductId, consumption => {
      expect(consumption).toEqual(mockedConsumption)
    })

    sut.listenToConsumptions(otherMockedProductId, consumption => {
      expect(consumption).toEqual(mockedConsumption)
    })

    sut.publishConsumption(mockedProductId, mockedConsumption)
    sut.publishConsumption(otherMockedProductId, mockedConsumption)
  })
})

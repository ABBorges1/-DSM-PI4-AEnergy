import { mock } from 'vitest-mock-extended'
import { GetDailyProductConsumptions } from '../../../../src/v1/products/domain/usecases/get-daily-product-consumptions'
import { describe, vitest, beforeEach, test, expect } from 'vitest'

describe('GetDailyProductConsumptions', () => {
  let sut
  let productRepository
  let distributorGateway
  const mockedPrice = 0.9

  beforeEach(() => {
    productRepository = mock({
      getDayConsumptions: vitest.fn().mockResolvedValue([
        { kw: 10, hour: 1 },
        { kw: 12, hour: 3 },
      ]),
    })

    distributorGateway = mock({
      getKwmDistributorPrice: vitest.fn().mockResolvedValue(mockedPrice),
    })

    sut = new GetDailyProductConsumptions({
      productRepository,
      distributorGateway,
    })
  })

  test('should return an array of 24 positions representing the hours of the day', async () => {
    const response = await sut.execute({
      date: new Date(),
      productId: 'any_id',
      distributorId: 'any_id',
    })

    const expectedResult = {
      consumptionsInKw: [
        0, 10, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      consumptionsInMoney: [
        0, 9, 0, 10.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    }

    expect(response).toEqual(expectedResult)
  })

  test('should throw if productRepository throws', async () => {
    productRepository.getDayConsumptions.mockRejectedValueOnce(
      new Error('any_error')
    )

    const promise = sut.execute({
      date: new Date(),
      productId: 'any_id',
    })

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})

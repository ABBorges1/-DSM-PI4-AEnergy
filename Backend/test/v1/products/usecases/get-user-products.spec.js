import { describe, beforeEach, test, vitest, expect } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { GetUserProducts } from '../../../../src/v1/products/domain/usecases/get-user-products'
import { mockProduct } from '../../__mocks__/product.mock'
import { faker } from '@faker-js/faker'

describe('GetUserProducts', () => {
  let sut
  let productRepository
  let userId
  const mockedProducts = [mockProduct()]

  beforeEach(() => {
    userId = faker.datatype.uuid()
    productRepository = mock({
      findUserProducts: vitest.fn().mockResolvedValue(mockedProducts),
    })

    sut = new GetUserProducts({
      productRepository,
    })
  })

  test('should find all user products', async () => {
    const products = await sut.execute({ userId })

    expect(products).toEqual(mockedProducts)
    expect(productRepository.findUserProducts).toHaveBeenCalledTimes(1)
    expect(productRepository.findUserProducts).toHaveBeenCalledWith({
      userId,
    })
  })
})

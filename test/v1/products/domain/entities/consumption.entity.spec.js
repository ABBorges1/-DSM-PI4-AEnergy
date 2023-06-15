import { describe, expect, test } from 'vitest'
import { Consumption } from '../../../../../src/v1/products/domain/entities/consumption.entity'

describe('Consumption', () => {
  test('should create an consumption with correct kwm', () => {
    const consumption = Consumption.create({
      eletricCurrent: 2.5,
      power: 62.5,
      productId: 1,
    })

    expect(consumption.kwm).toBe(0.001042)
  })
})

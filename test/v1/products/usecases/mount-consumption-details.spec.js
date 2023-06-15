import { beforeEach, describe, expect, test } from 'vitest'
import { MountConsumptionDetails } from '../../../../src/v1/products/domain/usecases/mount-consumption-details'

describe('MountConsumptinoDetails', () => {
  /**
   * @type {MountConsumptionDetails}
   */
  let sut

  function makeConsumptions() {
    return {
      consumptionsInKw: [2, 2],
      consumptionsInMoney: [10, 10],
    }
  }

  beforeEach(() => {
    sut = new MountConsumptionDetails()
  })

  test('should return the correct averages', () => {
    const {
      consumptionsInKw: { average: averageKw },
      consumptionsInMoney: { average: averageMoney },
    } = sut.execute(makeConsumptions())

    const expectedMoneyAverage = 10
    const expectedKwmAverage = 2

    expect(averageKw).toEqual(expectedKwmAverage)
    expect(averageMoney).toEqual(expectedMoneyAverage)
  })

  test('should return the correct modes', () => {
    const consumptions = {
      consumptionsInKw: [2, 2, 3, 5, 6, 8, 8],
      consumptionsInMoney: [10, 10, 1, 2, 5, 5],
    }
    const {
      consumptionsInKw: { mode: kwModes },
      consumptionsInMoney: { mode: moneyModes },
    } = sut.execute(consumptions)

    const expectedMoneyModes = [2, 8]
    const expectedKwmModes = [10, 5]

    expect(kwModes).toEqual(expectedMoneyModes)
    expect(moneyModes).toEqual(expectedKwmModes)
  })

  test('should return the correct standard deviation', () => {
    const consumptions = {
      consumptionsInKw: [2, 4, 6, 8, 10],
      consumptionsInMoney: [2, 4, 6, 8, 10],
    }
    const {
      consumptionsInKw: { standardDeviation: kwStandardDeviation },
      consumptionsInMoney: { standardDeviation: moneyStandartDeviation },
    } = sut.execute(consumptions)

    const expectedMoneyStandardDeviation = 2.83
    const expectedKwmStandardDeviation = 2.83

    expect(kwStandardDeviation).toEqual(expectedKwmStandardDeviation)
    expect(moneyStandartDeviation).toEqual(expectedMoneyStandardDeviation)
  })
})

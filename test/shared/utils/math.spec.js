import { describe, expect, test } from 'vitest'
import { MathHelper } from '../../../src/v1/shared/utils/math'

describe('MathHelper', () => {
  describe('getMode()', () => {
    test('should return the mode of an number array', () => {
      const numbers = [1, 1, 2, 3, 4, 5, 2]
      const expectedMode = [1, 2]

      const modes = MathHelper.getMode(numbers)

      expect(modes).toEqual(expectedMode)
    })
  })

  describe('getAverage()', () => {
    test('should return the average of an array of numbers', () => {
      const numbers = [2, 4]
      const expectedAverage = 3

      const result = MathHelper.getAverage(numbers)

      expect(result).toEqual(expectedAverage)
    })

    describe('ignore falsy numbers', () => {
      test('should ignore all negative or zeros from the average', () => {
        const numbers = [2, 4, 0, 0, 0, 0, 0, 0]
        const expectedAverage = 3

        const result = MathHelper.getAverage(numbers, {
          ignoreFalsyNumbers: true
        })

        expect(result).toEqual(expectedAverage)
      })
    })
  })

  describe('getStandardDesviation()', () => {
    test('should be able to return the standar desviation of an array fo numbers', () => {
      const numbers = [2, 4, 6, 8, 10]
      const expectedStandardDesviation = 2.83

      const result = MathHelper.getStandardDeviation(numbers)

      expect(result).toEqual(expectedStandardDesviation)
    })
  })
})

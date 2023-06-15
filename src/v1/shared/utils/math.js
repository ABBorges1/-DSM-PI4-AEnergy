export class MathHelper {
  static getMode(numbers) {
    const frequencies = new Map()
    let maxFrequency = 0
    let modes = []

    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i]
      const numberFrequency = (frequencies.get(number) || 0) + 1
      frequencies.set(number, numberFrequency)

      if (numberFrequency > maxFrequency) {
        maxFrequency = numberFrequency
        modes = [number]
      } else if (numberFrequency === maxFrequency) {
        modes.push(number)
      }
    }

    return modes
  }

  static getAverage(numbers = [], { ignoreFalsyNumbers = false } = {}) {
    const sum = numbers.reduce(
      (accumulator, element) => accumulator + element,
      0
    )

    if (ignoreFalsyNumbers) {
      return sum / numbers.filter(number => number > 0).length
    }

    return sum / numbers.length
  }

  static getStandardDeviation(numbers = []) {
    const average = MathHelper.getAverage(numbers)

    const squaredDifferencesSum = numbers.reduce((accumulator, element) => {
      const difference = element - average
      return accumulator + Math.pow(difference, 2)
    }, 0)

    const variance = squaredDifferencesSum / numbers.length
    const standardDeviation = Math.sqrt(variance)

    return Number(standardDeviation.toFixed(2))
  }
}

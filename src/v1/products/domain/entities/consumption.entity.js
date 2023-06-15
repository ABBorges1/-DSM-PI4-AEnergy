class Consumption {
  constructor({ id, eletricCurrent, power, kwmDate, productId }) {
    this.id = id
    this.eletricCurrent = eletricCurrent
    this.power = power
    this.kwmDate = kwmDate || new Date()
    this.productId = productId
    this.kwm = Number((this.power / 60 / 1000).toFixed(6))
  }

  static create({ id, eletricCurrent, power, kwmDate = new Date(), productId }) {
    return new Consumption({ id, eletricCurrent, power, kwmDate, productId })
  }
}

export { Consumption }
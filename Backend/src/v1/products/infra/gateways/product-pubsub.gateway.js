import { Consumption } from '../../domain/entities/consumption.entity'
import { ProductPubSubGateway } from '../../domain/protocols/gateways/product-pubsub.gateway'
export class ProductPubSubEventEmitter extends ProductPubSubGateway {
  /**
   * @type {ProductPubSubEventEmitter}
   */
  static instance = null
  #listeners = new Map()

  static create() {
    if (!ProductPubSubEventEmitter.instance) {
      ProductPubSubEventEmitter.instance = new ProductPubSubEventEmitter()
    }

    return ProductPubSubEventEmitter.instance
  }

  publishConsumption(productId, consumption) {
    console.log(
      `ProductPubSubEventEmitter[listenToConsumptions] new consumption for product id ${productId}`
    )

    for (const [id, handler] of this.#listeners.entries()) {
      console.log(id)
      const [subId, listenerProductId] = id.split(' ')
      if (listenerProductId.toString() !== productId.toString()) {
        return
      }

      try {
        console.log(
          `ProductPubSubEventEmitter[publishConsumption] emitting consumption of product id ${productId} to subs ${subId}`,
          consumption
        )
        handler(consumption)
      } catch (error) {
        console.error(
          `ProductPubSubEventEmitter[publishConsumption] error on ${id}`
        )
      }
    }
  }

  /**
   *
   * @param {{productId: number | string, subscriberId: number | string}} ids
   * @param {(consumption: Consumption) => void} handler
   */
  listenToConsumptions({ productId, subscriberId }, handler) {
    console.log(
      `ProductPubSubEventEmitter[listenToConsumptions] add listener ${subscriberId} for product id ${productId} consumptions`
    )

    this.#listeners.set(`${subscriberId} ${productId}`, handler)
  }

  unsubcribe({ subscriberId }) {
    console.log(this.#listeners)
    console.log('unsubscribed', subscriberId)
    for (const [id] of this.#listeners.entries()) {
      const [subId, productId] = id.split(' ')
      if (subscriberId === subId) {
        this.#listeners.delete(`${subId} ${productId}`)
      }
    }
    console.log(this.#listeners)

  }
}

import { Server } from 'socket.io'
import { ProductPubSubEventEmitter } from '../products/infra/gateways/product-pubsub.gateway'
import { makeGetLastHalfHourConsumptions } from '../products/main/factories/domain/usecases/get-last-hour-consumptions.factory'

export const SOCKET_EVENTS = {
  products: {
    SUBSCRIBE_CONSUMPTIONS: 'products:subscribe-consumptions',
    NEW_CONSUMPTION: 'products:new-consumption',
  },
}

export function makeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })
  const getLastHourConsumptions = makeGetLastHalfHourConsumptions()
  const productPubSub = ProductPubSubEventEmitter.create()

  io.of('/products').on('connection', clientSocket => {
    console.log(`new socket connection: ${clientSocket.id}`)

    clientSocket.on(
      SOCKET_EVENTS.products.SUBSCRIBE_CONSUMPTIONS,
      async ({ productId }, callback = () => {}) => {
        console.log('Subscribing', clientSocket.id, 'to', productId)
        if (!productId) {
          return callback({
            message: 'Missing productId!',
          })
        }

        productPubSub.listenToConsumptions(
          { productId, subscriberId: clientSocket.id },
          consumption => {
            clientSocket.emit(
              SOCKET_EVENTS.products.NEW_CONSUMPTION,
              consumption
            )
          }
        )

        try {
          const lastConsumptions = await getLastHourConsumptions.execute({
            productId,
          })
          return callback(lastConsumptions)
        } catch (error) {
          console.error('Failed to get last hour consumptions', error)
          return callback([])
        }
      }
    )

    clientSocket.on('disconnect', () => {
      productPubSub.unsubcribe({
        subscriberId: clientSocket.id,
      })
    })
  })

  return io
}

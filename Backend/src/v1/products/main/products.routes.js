import { hapiErrorHandler } from '../../config/http/error-handler'
import { makeProductController } from './factories/application/controllers/product.controller.factory'

const productController = makeProductController()
export const productRoutes = [
  {
    method: 'POST',
    /**
     * @todo passar a rota para /products/{id}/consumption, porém, precisaremos mudar no IOT @ABBorges1
     */
    path: '/consumption',
    config: {
      auth: false,
      description: 'Register Consumption',
    },
    /**
     *
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     * @returns
     */
    handler: async (request, h) => {
      try {
        const consumption = await productController.registerConsumption({
          ...request.payload,
        })
        return h.response(consumption).code(201)
      } catch (error) {
        return hapiErrorHandler(error, h)
      }
    },
  },
  {
    method: 'GET',
    path: '/products',
    config: {
      description: 'Get User Products',
    },
    /**
     *
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     * @returns
     */
    handler: async (request, h) => {
      try {
        const products = await productController.getUserProducts({
          userId: request.auth.credentials.user.id,
        })
        return h.response(products).code(200)
      } catch (error) {
        return hapiErrorHandler(error, h)
      }
    },
  },
  {
    method: 'GET',
    path: '/products/{id}/consumptions',
    config: {
      description: 'Get Consumptions',
    },
    /**
     *
     * @param {import('@hapi/hapi').Request} request
     * @param {import('@hapi/hapi').ResponseToolkit} h
     * @returns
     */
    handler: async (request, h) => {
      try {
        const consumptions = await productController.getConsumptions({
          type: request.query.type,
          date: request.query.date,
          distributorId: request.query.distributorId,
          productId: request.params.id,
        })
        return h.response(consumptions).code(200)
      } catch (error) {
        return hapiErrorHandler(error, h)
      }
    },
  },
]

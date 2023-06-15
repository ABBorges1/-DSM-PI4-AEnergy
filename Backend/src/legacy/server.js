import Hapi from '@hapi/hapi'

import userRoutes from './routes/user.routes'
import consumptionRoutes from './routes/consumption.routes'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'

const server = Hapi.server({
  port: 8080,
  host: '0.0.0.0',
})

// Inicializando as rotas
userRoutes.forEach(path => server.route(path))
authRoutes.forEach(path => server.route(path))
productRoutes.forEach(path => server.route(path))
consumptionRoutes.forEach(path => server.route(path))

export default server

import { server } from './server'
import blipp from 'blipp'
import Jwt from '@hapi/jwt'
import cors from 'hapi-cors'
import { env } from './env'
import { makeSocketServer } from './socket-server'

const start = async () => {
  try {
    const io = makeSocketServer(server.listener)
    await server.register(Jwt)

    await server.register({ plugin: cors })

    server.auth.strategy('jwt', 'jwt', {
      keys: env.JWT_SECRET,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400,
        timeSkewSec: 15,
      },
      validate: artifacts => {
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload },
        }
      },
    })
    server.auth.default('jwt')

    await server.register(blipp)

    await server.start()
    console.log(`Server started ${server.info.uri}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

start()

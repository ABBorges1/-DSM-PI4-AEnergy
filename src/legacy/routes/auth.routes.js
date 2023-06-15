
import * as AuthController from '../controllers/auth'
import * as AuthSchema from '../schemas/auth.schemas'

const routesAuth = [
    {
        method: "POST",
        path: '/auth',
        config:{
            auth: false,
            description: 'Authenticate User',
            handler: AuthController.auth,
            validate:  AuthSchema.auth
        }
    },

    {
        method: "GET",
        path: '/teste',
        config:{
            auth: false,
            handler: (req, h) =>{
                return h.response('OPAAAA')
            }
        }
    },
]

export default routesAuth
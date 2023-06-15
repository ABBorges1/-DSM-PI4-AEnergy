import * as UserControler from '../controllers/user.controller'
import * as UserSchema from '../schemas/user.schemas'


const routesUser = [
    {
        method: "POST",
        path: '/user',
        config: {
            auth: false,
            description: 'Register User',
            handler: UserControler.create,
            validate: UserSchema.create,
        }
    },
    {
        method: "GET",
        path: '/user/{id}',
        config: {
            description: 'Infos User',
            handler: UserControler.searchOneUser,
            validate: UserSchema.search,
        }
    },
]

export default routesUser
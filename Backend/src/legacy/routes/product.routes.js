import * as  controller from '../controllers/product.controller'
import * as schema from '../schemas/products.schema'

const productRoutes = [
    {
        method: 'GET',
        path: '/product/{idUser}',
        config:{
            description: 'Search products',
            handler: controller.searchProuct,
            validate: schema.product
        }
    },
    {
        method: 'PUT',
        path: '/product/{idUser}',
        config:{
            description: 'Search products',
            handler: controller.updateProduct,
            validate: schema.productUpdate
        }
    }
]

export default productRoutes
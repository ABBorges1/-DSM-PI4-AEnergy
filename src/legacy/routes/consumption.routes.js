import * as ConsumptionController from '../controllers/consumption.controller'
import * as ConsumptionSchema from '../schemas/consumption.schemas'

const routesConsumption = [
    {
        method: "POST",
        path: '/consumption',
        config:{
            auth: false,
            description: 'Register Consumption',
            handler: ConsumptionController.convertConsumtion,
            validate: ConsumptionSchema.consumptionRegister
        }
    },
    {
        method: "GET",
        path: '/products/{product}/consumption',
        config:{
            description: 'Search Consumptions',
            handler: ConsumptionController.searchConsumptions,
            validate: ConsumptionSchema.searchConsumptions
        }
    }
]

export default routesConsumption
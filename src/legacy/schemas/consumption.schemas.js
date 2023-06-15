import joi from 'joi';

const consumptionRegister = {
    payload: joi.object({
        power: joi.number().required(),
        current: joi.number().required(),
        idProduct: joi.number().required()
    }).required()
}

const searchConsumptions = {
    query: joi.object({
        date_initial: joi.string(),
        date_end: joi.string(),
        amount_initial: joi.number(),
        amount_end: joi.number()
    }),

    params: joi.object({
        product: joi.number().required()
    })
}

export {consumptionRegister, searchConsumptions}
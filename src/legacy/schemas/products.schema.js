import joi from 'joi'

const product = {
    params: joi.object({
        idUser:  joi.number().required()
    }).required()
}

const productUpdate = {
    payload: joi.object({
        Name: joi.string().required(),
        idUser: joi.number().required(),
        UUID: joi.string().required()
    })
}

export {product, productUpdate}
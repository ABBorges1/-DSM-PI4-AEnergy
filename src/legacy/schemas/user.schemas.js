import joi from 'joi'

const create = {
    payload: joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().min(6).required()
    }).required()
}

const search = {
    params: joi.object({
        id: joi.number().required()
    })
}

export {create, search}
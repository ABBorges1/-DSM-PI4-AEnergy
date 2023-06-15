import { ProductController } from '../../../../application/controllers/product.controller'
import {
  makeGetDailyConsumptions,
  makeGetMonthlyProductConsumptions,
  makeRegisterConsumption,
  makeMountConsumptionDetails,
  makeGetUserProducts,
} from '../../domain/usecases'

export function makeProductController() {
  return new ProductController({
    registerConsumption: makeRegisterConsumption(),
    getDailyConsumptions: makeGetDailyConsumptions(),
    getMonthlyConsumptions: makeGetMonthlyProductConsumptions(),
    mountConsumptionDetails: makeMountConsumptionDetails(),
    getUserProducts: makeGetUserProducts(),
  })
}

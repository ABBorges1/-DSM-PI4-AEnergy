import moment from 'moment'
import { InvalidParamError } from '../../../shared/errors/invalid-param-error'
import {
  RegisterConsumption,
  GetDailyProductConsumptions,
  GetMonthlyProductConsumption,
  MountConsumptionDetails,
  GetUserProducts,
} from '../../domain/usecases'

export class ProductController {
  /**
   * @type {RegisterConsumption}
   */
  #registerConsumption
  /**
   * @type {GetDailyProductConsumptions}
   */
  #getDailyConsumptions
  /**
   * @type {GetMonthlyProductConsumption}
   */
  #getMonthlyConsumptions
  /**
   * @type {MountConsumptionDetails}
   */
  #mountConsumptionDetails
  /**
   * @type {GetUserProducts}
   */
  #getUserProducts

  constructor({
    registerConsumption,
    getDailyConsumptions,
    getMonthlyConsumptions,
    mountConsumptionDetails,
    getUserProducts,
  }) {
    this.#registerConsumption = registerConsumption
    this.#getDailyConsumptions = getDailyConsumptions
    this.#getMonthlyConsumptions = getMonthlyConsumptions
    this.#mountConsumptionDetails = mountConsumptionDetails
    this.#getUserProducts = getUserProducts
  }

  async getUserProducts({ userId }) {
    return this.#getUserProducts.execute({ userId })
  }

  async registerConsumption(data) {
    const { current: eletricCurrent, power, idProduct } = data
    const consumption = await this.#registerConsumption.execute({
      eletricCurrent,
      power,
      productId: idProduct,
    })

    return consumption
  }

  /**
   *
   * @param {{type: typeof GET_CONSUMPTIONS_TYPES, date: Date, productId: string, distributorId: string}} param0
   */
  async getConsumptions({ type, date, productId, distributorId }) {
    let consumptions = null
    const formattedDate = moment(date, 'YYYY-MM-DD HH:mm:ss').toDate()
    const supportedTypes = Object.values(GET_CONSUMPTIONS_TYPES)
    const isNonSupportedType = !supportedTypes.includes(type)

    if (isNonSupportedType) {
      throw new InvalidParamError(
        'type',
        `O tipo ${type} não é suportado, os únicos suportados são: ${supportedTypes.join(
          ', '
        )}`
      )
    }
    if (type === GET_CONSUMPTIONS_TYPES.DAILY) {
      consumptions = await this.#getMonthlyConsumptions.execute({
        date: formattedDate,
        productId,
        distributorId,
      })
    }

    if (type === GET_CONSUMPTIONS_TYPES.HOURLY) {
      consumptions = await this.#getDailyConsumptions.execute({
        date: formattedDate,
        productId,
        distributorId,
      })
    }

    return this.#mountConsumptionDetails.execute(consumptions)
  }
}

export const GET_CONSUMPTIONS_TYPES = {
  DAILY: 'daily',
  HOURLY: 'hourly',
}

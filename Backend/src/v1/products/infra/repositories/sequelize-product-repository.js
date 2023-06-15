import { QueryTypes } from 'sequelize'
import sequelizeDb from '../../../config/database/sequelize-db'
import { ProductRepository } from '../../domain/protocols/repositores/product.repository'
import { Product } from '../../domain/entities/product.entity'
import { Consumption } from '../../domain/entities/consumption.entity'

export class SequelizeProductRepository extends ProductRepository {
  async findById(id) {
    console.log(
      'SequelizeProductRepository[findById]',
      `called with product id: ${id}`
    )
    const sql = `
    SELECT P.Name, P.id, P.UUID, P.idUser FROM Products as P 
    WHERE P.id = :id
    `

    const [dbProduct] = await sequelizeDb.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { id },
    })

    if (!dbProduct) return null

    return Product.create({
      id: dbProduct.id,
      name: dbProduct.Name,
      uuid: dbProduct.UUID,
      userId: dbProduct.idUser,
    })
  }

  /**
   *
   * @param {Consumption} consumption
   * @returns
   */
  async registerConsumption(consumption) {
    const { eletricCurrent, power, kwm, kwmDate, productId } = consumption
    const sql = `
          INSERT INTO ConsumptionData(EletricCurrent, Power, KwmDate, Kwm, idProduct)
              VALUES(:current, :power, :now, :kwm, :idProduct)`

    const [id] = await sequelizeDb.query(sql, {
      replacements: {
        current: eletricCurrent,
        power,
        kwm,
        idProduct: productId,
        now: kwmDate,
      },
      type: QueryTypes.INSERT,
    })

    return { id }
  }

  async getDayConsumptions({ date, productId }) {
    const sql = `
      SELECT SUM(Kwm) as kw, HOUR(KwmDate) as hour
      FROM ConsumptionData
      WHERE 
        idProduct = :productId 
        AND DAY(KwmDate) = DAY(:kwmDate)
        AND MONTH(KwmDate) = MONTH(:kwmDate)
        AND YEAR(KwmDate) = YEAR(:kwmDate)
      GROUP BY HOUR(KwmDate)
    `

    const [results] = await sequelizeDb.query(sql, {
      replacements: {
        productId,
        kwmDate: date,
      },
    })

    return results
  }

  async getMonthConsumptions({ date, productId }) {
    const sql = `
      SELECT SUM(Kwm) as kw, DAY(KwmDate) as dayOfMonth
      FROM ConsumptionData
      WHERE 
        idProduct = :productId
        AND YEAR(KwmDate) = YEAR(:kwmDate)
        AND MONTH(KwmDate) = MONTH(:kwmDate)
      GROUP BY DAY(KwmDate);
    `

    const [results] = await sequelizeDb.query(sql, {
      replacements: {
        productId,
        kwmDate: date,
      },
    })

    return results
  }

  async findUserProducts({ userId }) {
    const sql = `SELECT id, Name, UUID, idUser FROM Products where idUser = :userId`

    const [results] = await sequelizeDb.query(sql, {
      replacements: {
        userId,
      },
    })

    return results.map(product => {
      return new Product({
        id: product.id,
        name: product.Name,
        userId: product.idUser,
        uuid: product.UUID,
      })
    })
  }

  async getLast30MinConsumptions({ productId }) {
    const now = new Date()
    const sql = `SELECT * from ConsumptionData where idProduct = :productId and KwmDate >= DATE_SUB(:now, INTERVAL 30 MINUTE) ORDER BY KwmDate DESC`

    const [results] = await sequelizeDb.query(sql, {
      replacements: {
        productId,
        now
      },
    })

    return results.map(consumptionDb =>
      Consumption.create({
        eletricCurrent: consumptionDb.EletricCurrent,
        id: consumptionDb.id,
        power: consumptionDb.Power,
        productId: consumptionDb.idProduct,
        kwmDate: consumptionDb.KwmDate,
      })
    )
  }
}

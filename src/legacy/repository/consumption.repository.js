import db from '../database/db'
import sequelize from 'sequelize'

const registerConsumption = async ({ current, power, kwm, idProduct }) => {
  try {
    const now = new Date()
    const sql = `
        INSERT INTO ConsumptionData(EletricCurrent, Power, KwmDate, Kwm, idProduct)
            VALUES(:current, :power, :now, :kwm, :idProduct)`
    const res = await db.query(sql, {
      replacements: { current, power, kwm, idProduct, now },
      type: sequelize.QueryTypes.INSERT,
    })
    console.log(sql)
    return res
  } catch (error) {
    console.error(error)
    throw error
  }
}

const searchConsumptions = async (
  product,
  date_initial,
  date_end,
  amount_initial,
  amount_end
) => {
  try {
    const sql = `
        SELECT EletricCurrent, Kwm, Power, KwmDate
            FROM  ConsumptionData WHERE idProduct = :product`

    const res = await db.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { product },
    })
    console.log(`Res sql search consumption?: ${res}`)
    return res
  } catch (error) {
    return error
  }
}

export { registerConsumption, searchConsumptions }

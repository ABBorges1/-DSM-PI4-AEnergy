import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'
import moment from 'moment'
import { server } from '../../../src/v1/config/server'
import sequelize from '../../../src/v1/config/database/sequelize-db'
import {
  dropTables,
  migrateTables,
} from '../../../src/v1/config/database/migrate-database'
import { QueryTypes } from 'sequelize'
import { GET_CONSUMPTIONS_TYPES } from '../../../src/v1/products/application/controllers/product.controller'

describe('Products E2E Suite', () => {
  async function makeUser() {
    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const [id] = await sequelize.query(
      `
      INSERT INTO Users (Name, Login, Password) VALUES
       ('${user.name}', '${user.email}', '${user.password}');`
    )
    user.id = id
    return user
  }

  async function makeProduct(user) {
    const product = {
      name: 'Product 1',
      uuid: faker.datatype.uuid(),
      userId: user.id,
    }

    const [id] = await sequelize.query(
      `
      INSERT INTO Products (Name, UUID, idUser) VALUES
        ('${product.name}', '${product.uuid}', '${product.userId}');`
    )
    product.id = id

    return product
  }

  async function makeConsumption(product, modifications = {}) {
    const consumption = {
      current: faker.datatype.number(),
      power: faker.datatype.number(),
      kwm: faker.datatype.number(),
      kwmDate: faker.date.recent(),
      idProduct: product.id,
      ...modifications,
    }

    const [id] = await sequelize.query(
      `
      INSERT INTO ConsumptionData (EletricCurrent, Power, KwmDate, Kwm, idProduct) VALUES
        (:current, :power, :kwmDate, :kwm, :idProduct);
      `,
      {
        replacements: {
          current: consumption.current,
          power: consumption.power,
          kwmDate: consumption.kwmDate,
          kwm: consumption.kwm,
          idProduct: consumption.idProduct,
        },
        type: QueryTypes.INSERT,
      }
    )
    consumption.id = id

    return consumption
  }

  describe('POST /consumption', () => {
    const actualDate = new Date()
    beforeAll(() => {
      MockDate.set(actualDate)
    })
    beforeEach(async () => {
      await migrateTables()
    })

    afterEach(async () => {
      await dropTables()
    })

    afterAll(async () => {
      MockDate.reset()
    })

    test('should save the consumption converted on the database', async () => {
      const user = await makeUser()
      const product = await makeProduct(user)

      const given = {
        current: 2.5,
        power: 62.5,
        idProduct: product.id,
      }

      const response = await supertest(server.listener)
        .post('/consumption')
        .send(given)

      expect(response.status).toBe(201)

      const [[dbConsumption]] = await sequelize.query(
        `SELECT * FROM ConsumptionData;`
      )

      const expectedKwm = 0.001042

      const expectedConsumption = {
        id: expect.any(Number),
        Power: given.power,
        EletricCurrent: given.current,
        Kwm: expectedKwm,
        KwmDate: moment(actualDate).format('yyyy-MM-dd HH:mm:ss'),
        idProduct: given.idProduct,
      }

      expect({
        ...dbConsumption,
        KwmDate: moment(dbConsumption.KwmDate).format('yyyy-MM-dd HH:mm:ss'),
      }).toEqual(expectedConsumption)
    })
  })

  describe('GET /products/{id}/consumptions', () => {
    const actualDate = new Date()
    beforeAll(() => {
      MockDate.set(actualDate)
    })
    beforeEach(async () => {
      await migrateTables()
    })

    afterEach(async () => {
      await dropTables()
    })

    afterAll(async () => {
      MockDate.reset()
    })

    test('should return 400 with invalid param if invalid type is provided', async () => {
      const type = 'invalid_type'
      const distributorId = 1
      const date = actualDate
      const user = await makeUser()
      const product = await makeProduct(user)

      const response = await supertest(server.listener)
        .get(`/products/${product.id}/consumptions`)
        .query({
          type,
          date,
          distributorId,
        })

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual(
        'Parâmetro inválido: type. O tipo invalid_type não é suportado, os únicos suportados são: daily, hourly'
      )
    })

    test('should return the consumptions of the day in hours if type hourly is provided', async () => {
      const actualDate = moment('2023/01/01 00:00:00', 'YYYY/MM/DD HH:mm:ss')
      MockDate.set(actualDate)

      const type = GET_CONSUMPTIONS_TYPES.HOURLY
      const distributorId = 1
      const date = moment(actualDate).format('YYYY-MM-DD HH:mm:ss')
      const user = await makeUser()
      const product = await makeProduct(user)

      const oneHourAm = moment(actualDate).add(1, 'hour').toDate()
      const threeHourAm = moment(actualDate).add(3, 'hour').toDate()
      const fiveHourAm = moment(actualDate).add(5, 'hour').toDate()
      const endOfDay = moment(actualDate).endOf('day').toDate()

      await Promise.all([
        makeConsumption(product, {
          kwmDate: oneHourAm,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: oneHourAm,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: threeHourAm,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: fiveHourAm,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: endOfDay,
          kwm: 2,
        }),
      ])

      const response = await supertest(server.listener)
        .get(`/products/${product.id}/consumptions`)
        .query({
          date,
          type,
          distributorId,
        })

      expect(response.body).toEqual({
        consumptionsInKw: {
          average: 0.4166666666666667,
          max: 4,
          data: [
            0, 4, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2,
          ],
          mode: [0],
          standardDeviation: 1
        },
        consumptionsInMoney: {
          average: 0.375,
          max: 3.6,
          data: [
            0, 3.6, 0, 1.8, 0, 1.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1.8,
          ],
          mode: [0],
          standardDeviation: 0.9
        },
      })
    })

    test('should return the consumptions of the month in days if type monthly is provided', async () => {
      const actualDate = moment('2023/01/01 00:00:00', 'YYYY/MM/DD HH:mm:ss')
      MockDate.set(actualDate)

      const type = GET_CONSUMPTIONS_TYPES.DAILY
      const distributorId = 1
      const date = moment(actualDate).format('YYYY-MM-DD HH:mm:ss')
      const user = await makeUser()
      const product = await makeProduct(user)

      const dayOne = moment(actualDate).toDate()
      const dayThree = moment(actualDate).add(2, 'day').toDate()
      const dayFive = moment(actualDate).add(4, 'day').toDate()
      const endOfMonth = moment(actualDate).endOf('month').toDate()

      const [
        dayOneConsumption,
        secondDayOneConsumption,
        dayThreeConsumption,
        dayFiveConsumption,
        endOfMonthConsumption,
      ] = await Promise.all([
        makeConsumption(product, {
          kwmDate: dayOne,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: dayOne,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: dayThree,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: dayFive,
          kwm: 2,
        }),
        makeConsumption(product, {
          kwmDate: endOfMonth,
          kwm: 2,
        }),
      ])

      const response = await supertest(server.listener)
        .get(`/products/${product.id}/consumptions`)
        .query({
          date,
          type,
          distributorId,
        })

      expect(response.body).toEqual({
        consumptionsInKw: {
          average: 0.3225806451612903,
          max: 4,
          data: [
            dayOneConsumption.kwm + secondDayOneConsumption.kwm,
            0,
            dayThreeConsumption.kwm,
            0,
            dayFiveConsumption.kwm,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            endOfMonthConsumption.kwm,
          ],
          mode: [0],
          standardDeviation: 0.89,
        },
        consumptionsInMoney: {
          average: 0.2903225806451613,
          max: 3.6,
          data: [
            3.6, 0, 1.8, 0, 1.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 1.8,
          ],
          mode: [0],
          standardDeviation: 0.8,
        },
      })
    })
  })
})

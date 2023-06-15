import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import {
  dropTables,
  migrateTables,
} from '../../../../../src/v1/config/database/migrate-database'
import sequelize from '../../../../../src/v1/config/database/sequelize-db'
import { QueryTypes } from 'sequelize'
import MockDate from 'mockdate'
import { SequelizeProductRepository } from '../../../../../src/v1/products/infra/repositories/sequelize-product-repository'
import { Product } from '../../../../../src/v1/products/domain/entities/product.entity'
import { faker } from '@faker-js/faker'
import { Consumption } from '../../../../../src/v1/products/domain/entities/consumption.entity'
import moment from 'moment'

describe('SequelizeProductRepository', () => {
  let sut = new SequelizeProductRepository()

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

    return Product.create(product)
  }

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

  const actualDate = new Date()
  beforeAll(() => {
    MockDate.set(actualDate)
  })
  beforeEach(async () => {
    sut = new SequelizeProductRepository()
    await migrateTables()
  })

  afterEach(async () => {
    await dropTables()
  })

  afterAll(async () => {
    MockDate.reset()
  })

  describe('findById()', () => {
    test('should return the product according to the provided id', async () => {
      const dbUser = await makeUser()
      const dbProduct = await makeProduct(dbUser)

      const product = await sut.findById(dbProduct.id)

      expect(product.id).toEqual(dbProduct.id)
      expect(product.name).toEqual(dbProduct.name)
      expect(product.uuid).toEqual(dbProduct.uuid)
      expect(product.userId).toEqual(dbProduct.userId)
    })

    test('should return null if user does not exists', async () => {
      const dbUser = await makeUser()
      await makeProduct(dbUser)

      const product = await sut.findById('invalid_id')

      expect(product).toBeNull()
    })
  })

  describe('registerConsumption()', () => {
    test('should register the consumption', async () => {
      const user = await makeUser()
      const product = await makeProduct(user)

      const consumption = Consumption.create({
        eletricCurrent: 2.5,
        power: 62.5,
        productId: product.id,
      })

      const { id } = await sut.registerConsumption(consumption)

      expect(id).toBeTruthy()

      const [[dbConsumption]] = await sequelize.query(
        `SELECT * FROM ConsumptionData;`
      )

      expect(dbConsumption.id).toEqual(id)
      expect(dbConsumption.EletricCurrent).toEqual(consumption.eletricCurrent)
      expect(dbConsumption.Kwm).toEqual(consumption.kwm)
      expect(
        moment(dbConsumption.KwmDate).format('YYYY-MM-DD HH:mm:ss')
      ).toEqual(
        moment(consumption.kwmDate, 'YYYY-MM-DD HH:mm:ss').format(
          'YYYY-MM-DD HH:mm:ss'
        )
      )
      expect(dbConsumption.idProduct).toEqual(consumption.productId)
    })
  })

  describe('getDayConsumptions()', () => {
    test('should return the consumptions grouped by hour', async () => {
      const user = await makeUser()
      const product = await makeProduct(user)
      const actualDate = moment('2023/01/01 00:00:00', 'YYYY-MM-DD HH:mm:ss')
      MockDate.set(actualDate)

      const oneHourAm = moment(actualDate).add(1, 'hour').toDate()
      const threeHourAm = moment(actualDate).add(3, 'hour').toDate()
      const fiveHourAm = moment(actualDate).add(5, 'hour').toDate()

      const [
        oneHourAmConsumption,
        secondOneHourAmConsumption,
        threeHourAmConsumption,
        fiveHourAmConsumption,
      ] = await Promise.all([
        makeConsumption(product, {
          kwmDate: oneHourAm,
        }),
        makeConsumption(product, {
          kwmDate: oneHourAm,
        }),
        makeConsumption(product, {
          kwmDate: threeHourAm,
        }),
        makeConsumption(product, {
          kwmDate: fiveHourAm,
        }),
      ])

      const dayConsumptions = await sut.getDayConsumptions({
        date: actualDate.toDate(),
        productId: product.id,
      })

      expect(dayConsumptions).toEqual([
        {
          hour: 1,
          kw: oneHourAmConsumption.kwm + secondOneHourAmConsumption.kwm,
        },
        {
          hour: 3,
          kw: threeHourAmConsumption.kwm,
        },
        {
          hour: 5,
          kw: fiveHourAmConsumption.kwm,
        },
      ])
    })
  })

  describe('getDayConsumptions()', () => {
    test('should return the consumptions grouped by hour', async () => {
      const user = await makeUser()
      const product = await makeProduct(user)
      const actualDate = moment('2023/01/01 00:00:00', 'YYYY-MM-DD HH:mm:ss')
      MockDate.set(actualDate)

      const dayOne = moment(actualDate).toDate()
      const dayThree = moment(actualDate).add(2, 'day').toDate()
      const dayFive = moment(actualDate).add(4, 'day').toDate()

      const [
        dayOneConsumption,
        secondDayOneConsumption,
        dayThreeConsumption,
        dayFiveConsumption,
      ] = await Promise.all([
        makeConsumption(product, {
          kwmDate: dayOne,
        }),
        makeConsumption(product, {
          kwmDate: dayOne,
        }),
        makeConsumption(product, {
          kwmDate: dayThree,
        }),
        makeConsumption(product, {
          kwmDate: dayFive,
        }),
      ])

      const dayConsumptions = await sut.getMonthConsumptions({
        date: actualDate.toDate(),
        productId: product.id,
      })

      expect(dayConsumptions).toEqual([
        {
          dayOfMonth: 1,
          kw: dayOneConsumption.kwm + secondDayOneConsumption.kwm,
        },
        {
          dayOfMonth: 3,
          kw: dayThreeConsumption.kwm,
        },
        {
          dayOfMonth: 5,
          kw: dayFiveConsumption.kwm,
        },
      ])
    })
  })

  describe('getLast30MinConsumptions()', () => {
    test('should get last hour consumptions', async () => {
      const user = await makeUser()
      const product = await makeProduct(user)
      const actualDate = moment(
        '2023/01/01 01:01:00',
        'YYYY-MM-DD HH:mm:ss'
      ).toDate()
      MockDate.set(actualDate)
      console.log('acualDate', actualDate)
      const oneHourBefore = moment(actualDate).subtract(30, 'minute').toDate()
      console.log('oneHourBefore', oneHourBefore)
      const [oneHourBeforeConsumption, otherOneHourBeforeConsumption] =
        await Promise.all([
          makeConsumption(product, {
            kwmDate: oneHourBefore,
          }),
          makeConsumption(product, {
            kwmDate: oneHourBefore,
          }),
        ])

      const result = await sut.getLast30MinConsumptions({
        productId: product.id,
      })

      expect(result.length).toBe(2)
      expect(result[0].id).toEqual(oneHourBeforeConsumption.id)
      expect(result[1].id).toEqual(otherOneHourBeforeConsumption.id)
    })
  })
})

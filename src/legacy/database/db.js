import { Sequelize } from 'sequelize'
import { env } from '../config/env'

/**
 * @type {import('sequelize').Options}
 */
const config = {
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  dialect: env.DB_TYPE,
  port: env.DB_PORT,
  timezone: env.TZ,
  dialectOptions: {
    ssl: env.DB_CERT ? {
      require: true,
      rejectUnauthorized: false, // use this if you don't have a CA or self-signed certificate
      ca: env.DB_CERT,
    } : null,
  },
}

/**
 * @type {import('sequelize').Options}
 */
const testingConfig = {
  host: 'localhost',
  username: 'test',
  password: 'test',
  database: 'test',
  dialect: 'mysql',
  timezone: env.TZ,
  port: '3306',
}

const isTesting = env.NODE_ENV === 'test'
const sequelize = new Sequelize(isTesting ? testingConfig : config)

try {
  console.log('Conectando ao banco de dados...', config)
  sequelize.authenticate().then(() => {
    console.log(`Conectado ao banco aEnergy`)
  })
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

export default sequelize

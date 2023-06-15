import 'dotenv/config'
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: process.env.PORT || 8000,
  HOST: process.env.HOST || '0.0.0.0',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'test',
  DB_PASSWORD: process.env.DB_PASSWORD || 'test',
  DB_DATABASE: process.env.DB_DATABASE || 'test',
  DB_TYPE: process.env.DB_TYPE || 'mysql',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_CERT: process.env.DB_CERT,

  TZ: process.env.TZ || 'America/Sao_Paulo',

  JWT_SECRET: process.env.JWT_SECRET || 'secret',

  MOCKED_KWM_PRICE: process.env.MOCKED_KWM_PRICE || 0.9,
}

export { env }

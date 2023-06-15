import { env } from '../config/env'
import sequelize from './db'

async function migrateTables() {
  console.info('Migrating Tables...')
  try {
    await sequelize.authenticate()
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS Users (
    id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Login VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );
`)

    await sequelize.query(`
  CREATE TABLE IF NOT EXISTS Products (
    id INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    UUID VARCHAR(255) NOT NULL,
    idUser INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES Users (id)
  );
`)

    await sequelize.query(`
  CREATE TABLE IF NOT EXISTS ConsumptionData (
    id INT NOT NULL AUTO_INCREMENT,
    EletricCurrent FLOAT NOT NULL,
    Power FLOAT NOT NULL,
    KwmDate DATETIME NOT NULL,
    Kwm FLOAT NOT NULL,
    idProduct INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (idProduct) REFERENCES Products (id)
  );
`)
  } catch (error) {
    console.log(error)
    throw error
  }
  console.info('Tables migrated!')
}

async function dropTables() {
  try {
    await sequelize.authenticate()

    console.info('Dropping Tables...')
    await sequelize.query(`
      DROP TABLE ConsumptionData;
    `)

    await sequelize.query(`
      DROP TABLE Products;
    `)

    await sequelize.query(`
      DROP TABLE Users;
    `)
  } catch (error) {
    console.error(error)
  }

  console.info('Tables dropped!')
}

export { migrateTables, dropTables }
if (process.argv.includes('up')) {
  migrateTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

if (process.argv.includes('down')) {
  dropTables()
}

import db from '../database/db';
import sequelize from 'sequelize';

const register = async(Name, Email, Password) => {
   try {
    const sql = `INSERT INTO Users(Login, Name, Password) VALUES(:Email, :Name, :Password)`;

    const res = await db.query(sql, {
        replacements: {Email,Name,Password},
            type: sequelize.QueryTypes.INSERT
        })
    return res;
   } catch (error) {
    console.log(error);
   }
}

const searchUserByLogin = async (Login) => {
    try {
        const sql = `SELECT Login, Password, Name, id FROM Users where Login = :Login`;

        const res = await db.query(sql, {
            replacements: {Login},
            type: sequelize.QueryTypes.SELECT
        })

        return res;

    } catch (error) {
        console.log(error);
    }
}
const searchUserById = async (id) => {
    try {
        const sql = `SELECT Login, Name, id FROM Users where id = :id`;

        const res = await db.query(sql, {
            replacements: {id},
            type: sequelize.QueryTypes.SELECT
        })

        return res;

    } catch (error) {
        console.log(error);
    }
}

export {register, searchUserByLogin, searchUserById}
import db from '../database/db';
import sequelize from 'sequelize';

const searchProduct = async(idUser) => {
    try {
        const sql = `
        SELECT P.Name as NameProduct, P.id, P.UUID, P.idUser ,U.Name FROM Products as P 
        INNER JOIN Users as U ON P.idUser = U.id 
        WHERE U.id = :idUser`
        return res = await db.query(sql, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {idUser}
        })
    } catch (error) {
        return error
    }
}

const updateProduct = async(name, idUser, UUID) =>{
    try {
        const sql = `
        UPDATE Products SET Name = :name, idUser = :idUser WHERE UUID = :UUID`

        return res = db.query(sql, {
            type: sequelize.QueryTypes.UPDATE,
            replacements: {name, idUser, UUID}
        })
    } catch (error) {
        return error
    }
}

export {searchProduct, updateProduct}
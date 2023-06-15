import * as repository from '../repository/user.repository'
import bcrypt from 'bcrypt'

// Criar Usuarios no banco de dados
const create = async (req, h) => {
  //verificar se usuario ja nao existe
  const user = await searchUser(req.payload.email)

  if (user.length === 0) {
    //caso nao exista encryptar senha e capturar os dados necessarios
    const hash = await encrypt(req.payload.password)

    const { name, email } = req.payload
    const password = hash

    //registra o usuario
    await repository.register(name, email, password)
    return h.response({ msg: 'Usuário cadastrado com sucesso' }).code(201)
  } else {
    return h.response({ msg: 'Email ja cadastrado' }).code(400)
  }
}

const searchOneUser = async (req, h) => {
  const { id } = req.params

  console.log(id, 'iDDD')

  const userSearch = await repository.searchUserById(id)

  return h.response(userSearch).code(201)
}

async function searchUser(Login) {
  const userSearch = await repository.searchUserByLogin(Login)
  return userSearch
}

//função encripta a senha
function encrypt(password) {
  const saltRounds = 10

  return bcrypt.hashSync(password, saltRounds, function (err, hash) {
    if (err) {
      console.log(err)
    }
    return hash
  })
}

export { create, searchOneUser }

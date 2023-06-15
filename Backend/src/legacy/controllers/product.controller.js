import * as repository from '../repository/product.repository'

//busca produto
const searchProuct = async (req, h) => {
  const { idUser } = req.params

  const product = await repository.searchProduct(idUser)

  if (product.length > 0) {
    const productFormated = formatResponse(product)
    return h.response(productFormated).code(200)
  } else {
    return h.response({ msg: 'Produto não encontrado' }).code(404)
  }
}

//formata resposta para retornar
function formatResponse(products) {
  let product = []
  let user = []

  for (let i = 0; i < products.length; i++) {
    user = {
      id: products[i].idUser,
      Name: products[i].Name,
    }

    product.push({
      id: products[i].id,
      UUID: products[i].UUID,
      NameProduct: products[i].NameProduct,
      UserDetail: user,
    })
  }

  return product
}

const updateProduct = async (req, h) => {
  const { Name, idUser, UUID } = req.payload
  await repository.updateProduct(Name, idUser, UUID)
  return h.response({ msg: 'Produto atualizado com sucesso' })
}

export { searchProuct, updateProduct }

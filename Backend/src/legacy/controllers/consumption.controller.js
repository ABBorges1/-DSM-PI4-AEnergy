import * as repository from '../repository/consumption.repository'

const convertConsumtion = async (req, h) => {
  const { current: eletrictCurrent, power, idProduct } = req.payload
  const kwm = convertPowerToKwm(power)

  await repository.registerConsumption({
    current: eletrictCurrent,
    power,
    idProduct,
    kwm,
  })

  return h.response({ msg: 'Cadastro realizado com sucesso' }).code(201)
}

function convertPowerToKwm(powerPerMinute) {
  const kWm = Number(powerPerMinute / 60 / 1000).toFixed(6)

  return kWm
}

const searchConsumptions = async (req, h) => {
  //pegando os parametro caso exista
  const {
    date_initial = '',
    date_end = '',
    amount_initial = '',
    amount_end = '',
  } = req.query
  const { product } = req.params

  //buscando os dados no repository
  const consumptions = await repository.searchConsumptions(
    product,
    date_initial,
    date_end,
    amount_initial,
    amount_end
  )

  if (consumptions.length > 0) {
    const consumptionFormat = createPayloadResponse(consumptions)
    return h.response(consumptionFormat).code(200)
  }
  return h.response({ msg: 'Sem registro para esse produto' }).code(404)
}

//função para formatar a resposta do banco
function createPayloadResponse(consumptions) {
  let consumptionResponse = []
  let consumptionDetail = []

  for (let i = 0; i < consumptions.length; i++) {
    consumptionDetail.push({
      EletricCurrent: consumptions[i].EletricCurrent,
      Power: consumptions[i].Power,
      Kwm: consumptions[i].Kwm,
      Amount: consumptions[i].Amount,
    })

    consumptionResponse.push({
      Datetime: consumptions[i].KwmDate,
      ConsumptionDetail: consumptionDetail[i],
    })
  }

  return consumptionResponse
}

export { convertConsumtion, searchConsumptions, convertPowerToKwm }

export interface Consumption {
  consumptionsInKw : {
        data : number[],
        average: number,
        max: number
        total: number
        forecast: number
        standardDeviation: number
        futureForecast: number
    },

    consumptionsInMoney: {
        data: number[],
        average: number,
        max: number,
        total: number
        forecast: number
        standardDeviation: number
        futureForecast: number
    }
}

export interface ConsumptionSokect{
  kwmDate: Date,
  kwm: number,
  kwInMoney: number
}

export interface Types{
  description: string
  icon: string,
  type: string
}

export interface TypesChartOptions extends Types{
  borderColor: string,
  backgroundColor: string
}

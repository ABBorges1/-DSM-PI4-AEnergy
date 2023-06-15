import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import Chart from 'chart.js/auto';
import { Consumption, Types, TypesChartOptions } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';
import { PaginaInicialComponent } from '../pagina-inicial/pagina-inicial.component';

@Component({
  selector: 'app-dashboard-mensal',
  templateUrl: './dashboard-mensal.component.html',
  styleUrls: ['./dashboard-mensal.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class DashboardMensalComponent implements OnInit {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  @ViewChild('canva', { static: true }) element!: ElementRef;
  @ViewChild('canvaAllConsumption', { static: true }) element2!: ElementRef;
  chartJS!: Chart;
  colorGradChart = '#DEDEDE';
  chartJSBar!: any;
  date!: Date;
  daysOfMonth: number;
  consumptions!: Consumption;
  avearag!: number;
  max!: number;
  standardDeviation!: number;
  stateButtonUpdate: boolean = false;
  stateValuesConsumptions: boolean = true;
  type!: string;
  energyCard: boolean = false;
  moneyCard: boolean = false;
  dateInStorage!: string | null;
  futureForecast!: number;
  types = {
    energy: { description: 'Energia - KW', value: '1', icon: 'electric_bolt', type: 'kHw' },
    money: { description: `Dinheiro - R$`, value: '2', icon: 'payments', type: 'R$' }
  }

  typeConsumption: string = this.types.money.description;

  constructor(
    private initialPage: PaginaInicialComponent,
    private storageService: StorageService
  ) {
    this.date = new Date()
    this.daysOfMonth = this.getAmountDaysNoMonths(this.date.getFullYear(), this.date.getMonth()+1)
    this.dateInStorage = JSON.stringify(this.storageService.get('dateSelectedMonth'))
  }

  ngOnInit(): void {
    this.initialPage.$consumptionsMonth.subscribe({
      next: (value: any) => {
        this.avearag = value.average;
        this.max = value.max;
        this.standardDeviation = value.standardDeviation;
        this.futureForecast = value.forecast
        this.addDataInChart(value.data);
        this.dateInStorage = JSON.stringify(this.storageService.get('dateSelectedMonth') || '')
        this.stateValuesConsumptions = false;
      }
    })

    this.initialPage.type.subscribe({
      next: (value: TypesChartOptions) => {
        this.typeConsumption = value.description;
        this.type = value.type;
        this.stateValuesConsumptions = false;

        if(value.type === 'R$'){
          this.moneyCard = true
          this.energyCard = false
        }else{
          this.moneyCard = false
          this.energyCard = true
        }

        this.chartJS.data.datasets[0].backgroundColor = value.backgroundColor
        this.chartJS.data.datasets[0].borderColor = value.borderColor
        this.chartJS.data.datasets[0].label = this.typeConsumption
        this.chartJS.update()
      }
    })

    this.initialPage.$stateLoading.subscribe({
      next: (value: boolean) => {
        this.stateValuesConsumptions = value
      }
    })

    this.initialPage.$totalValuesConsumptions.subscribe({
      next: (value: number[]) => {
        this.chartJSBar.data.datasets[0].data = value
        this.chartJSBar.update()
      }
    })
  }

  ngAfterContentInit(): void {
    this.initChartLines();
    this.initChartBar();
  }

  get dateIsToday(): boolean {
    const year: number = new Date().getFullYear()
    const month: number = new Date().getMonth() + 1
    const day: number = this.date.getDate()
    const monthFormated = month.toString().length == 1 ? `0${month}` : month
    const completeDate = `${year}-${monthFormated}-${day}`

    return completeDate == JSON.parse(this.dateInStorage || '') ? true : false
  }

  private initChartLines() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: Array.from({ length: this.daysOfMonth}, (_, i: number) => {
          const day = i + 1
          const isTwoDigits = day.toString().length > 1
          const formattedHour = isTwoDigits ? `${day}` : `0${day}`
          return formattedHour
        }),
        datasets: [
          {
            label: `${this.typeConsumption}`,
            data: [],
            borderWidth: 6,
            borderColor: '#4bb774',
            borderCapStyle: 'round',
            backgroundColor: '#4bb77477',
            fill: true,
          },
        ],
      },
      options: {
        animation: {
          duration: 500,
          easing: 'linear',
          loop: false,
        },
        layout: {
          padding: {
            left: 20,
            bottom: 20,
            right: 20,
            top: 20,
          },
        },
        scales: {
          x: {
            grid: {
              color: this.colorGradChart
            }
          },
          y: {
            grid: {
              color: this.colorGradChart
            }
          }
        }
      },
    });
  }

  private initChartBar() {
    this.chartJSBar = new Chart(this.element2.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Dinheiro R$','Energia kWh'],
        datasets: [
          {
            data: [],
            borderWidth: 4,
            borderColor: ['#4bb774', '#4551B5'],
            backgroundColor: ['#4bb77477', '#4550b562'],
          }
        ],
      },
      options: {
        animation: {
          duration: 500,
          easing: 'linear',
          loop: false,
        },
        layout: {
          padding: {
            left: 20,
            bottom: 20,
            right: 20,
            top: 20,
          },
        },
        scales: {
          y: {
            beginAtZero: true
          },
        },
        plugins: {
          legend: {
            display: false
          }
        }
      },
    });
  }

  private addDataInChart(newData: any[]) {
    this.chartJS.data.datasets[0].data = newData
    this.chartJS.update()
    return
  }

  getAmountDaysNoMonths(ano: number, mes: number) {
    const data = new Date(ano, mes - 1, 1);
    data.setMonth(data.getMonth() + 1);
    data.setDate(data.getDate() - 1);
    return data.getDate();
  }
}

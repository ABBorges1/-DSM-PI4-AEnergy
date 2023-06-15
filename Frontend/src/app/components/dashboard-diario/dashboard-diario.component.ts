import { formatDate } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import Chart from 'chart.js/auto';
import { Consumption, Types, TypesChartOptions } from 'src/shared/interfaces/consumptions.-interface';
import { StorageService } from 'src/util/storage.service';
import { PaginaInicialComponent } from '../pagina-inicial/pagina-inicial.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-diario.component.html',
  styleUrls: ['./dashboard-diario.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class DashboardDiarioComponent implements OnInit {

  @ViewChild('canva', { static: true }) element!: ElementRef;
  @ViewChild('canvaAllConsumption', { static: true }) element2!: ElementRef;
  colorGradChart = '#DEDEDE'
  chartJS!: Chart;
  chartJSBar!: any;
  ChartJSPie!: any;
  consumptions!: Consumption;
  avearag!: number;
  max!: number;
  futureForecast!: number;
  standardDeviation!: number;
  stateButtonUpdate: boolean = false;
  stateValuesConsumptions: boolean = true;
  type!: string;
  total!: number[];
  energyCard: boolean = false;
  moneyCard: boolean = false;
  dateInStorage!: string;
  typeConsumption!: string;
  
  constructor(
    private storageService: StorageService,
    private initialPage: PaginaInicialComponent
  ) {
    this.dateInStorage = JSON.stringify(this.storageService.get('dayliDateSelected'))
  }

  ngOnInit(): void {
    this.initialPage.$consumptionsHourly.subscribe({
      next: (value: any) => {
        this.stateValuesConsumptions = false;
        this.avearag = value.average;
        this.max = value.max;
        this.standardDeviation = value.standardDeviation;
        this.futureForecast = value.forecast
        this.dateInStorage = JSON.stringify(this.storageService.get('dayliDateSelected'))
        this.addDataInChart(value.data);
      }
    })

    this.initialPage.type.subscribe({
      next: (value: TypesChartOptions) => {
        this.stateValuesConsumptions = false;
        this.typeConsumption = value.description;

        if(value.type === 'R$'){
          this.moneyCard = true
          this.energyCard = false
        }else{
          this.moneyCard = false
          this.energyCard = true
        }
        this.type = value.type;
        this.chartJS.data.datasets[0].backgroundColor = value.backgroundColor
        this.chartJS.data.datasets[0].borderColor = value.borderColor
        this.chartJS.data.datasets[0].label = this.typeConsumption
        this.chartJS.update()
      }
    })

    this.initialPage.$totalValuesConsumptions.subscribe({
      next: (value: number[]) => {
        this.total = value
        this.chartJSBar.data.datasets[0].data = this.total
        this.chartJSBar.update()
      }
    })

    this.initialPage.$stateLoading.subscribe({
      next: (value: boolean) => {
        this.stateValuesConsumptions = value
      }
    })
  }

  ngAfterContentInit(): void {
    this.initChartLines();
    this.initChartBar();
  }

  get consumptionsStorage() {
    return JSON.parse(this.storageService.get('dayliConsumprtions') || '{}')
  }

  get dateHourlyFromat(): boolean{
    const year: number = new Date().getFullYear()
    const month: number = new Date().getMonth() + 1
    const day: number = new Date().getDate()
    const monthFormated = month.toString().length == 1 ? `0${month}` : month
    const completeDate = `${year}-${monthFormated}-${day}`
    return completeDate == JSON.parse(this.dateInStorage || '') ? true: false
  }

  private initChartLines() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i: number) => {
          const hour = i
          const isTwoDigits = hour.toString().length > 1
          const formattedHour = isTwoDigits ? `${hour}:00` : `0${hour}:00`
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

  ngOnDestroy(): void {
  }

}

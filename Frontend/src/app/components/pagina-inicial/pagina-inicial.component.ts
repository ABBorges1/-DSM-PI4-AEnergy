import { HttpClient } from '@angular/common/http';
import { Component, Inject, Output } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { DashboardService } from '../../pages/home/home.service';
import { Product } from 'src/shared/interfaces/product-interface';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';
import { catchError, map, of } from 'rxjs';
import { UtilService } from 'src/util/util.service';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { MAT_DATE_LOCALE, DateAdapter} from '@angular/material/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
})
export class PaginaInicialComponent {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  $consumptionsHourly: Subject<any> = new Subject<any>();
  $consumptionsMonth: Subject<any> = new Subject<any>();
  $totalValuesConsumptions: Subject<number[]> = new Subject<number[]>();
  $connetSocket: Subject<boolean> = new Subject<boolean>();
  $stateLoading: Subject<boolean> = new Subject<boolean>()
  type: Subject<any> = new Subject<any>();
  consumptionsHourlyValues!: Consumption;
  consumptionsMonthValues!: Consumption
  msg!: string;
  period: number = new Date().getHours()
  date!: Date | string;
  datetimeHouly!: Date | string;
  datetimeMonth!: Date | string;
  idProduct!: number;
  avearag!: number;
  max!: number;
  totalMonthConsumptions: number[] = []
  totalHourlyConsumptions: number[] = []
  products!: Product[];
  stateButtonUpdate: boolean = false
  stateValuesConsumptions: boolean = true
  tabs!: string
  monthSelectes!: number
  todayNumber: number = new Date().getMonth()
  currentTime: number = new Date().getHours()
  types = {
    energy: { description: 'Energia - KW',  icon: 'electric_bolt', type: 'kWh', borderColor: '#4551B5',  backgroundColor: '#4550b562'  },
    money: { description: `Dinheiro - R$`, icon: 'payments', type: 'R$', borderColor: '#4bb774',  backgroundColor: '#4bb77477' }
  }
  months = [

    { name: 'Janeiro', monthNumber: 1},
    { name: 'Fevereiro', monthNumber: 2},
    { name: 'Março', monthNumber: 3},
    { name: 'Abril', monthNumber: 4},
    { name: 'Maio', monthNumber: 5},
    { name: 'Junho', monthNumber: 6},
    { name: 'Julho', monthNumber: 7},
    { name: 'Agosto', monthNumber: 8},
    { name: 'Setembro', monthNumber: 9},
    { name: 'Outubro', monthNumber: 10},
    { name: 'Novembro', monthNumber: 10},
    { name: 'Dezembro', monthNumber: 11}
  ]
  typeConsumption: string = this.types.money.description;
  tabIndicator!: any

  constructor(
    private StorageService: StorageService,
    private homeService: DashboardService,
    private utilService: UtilService,
    private _adapter: DateAdapter<any>,
    private router: Router
  ) {
    this._adapter.setLocale('pt-BR');
    this.date = new Date()
    this.datetimeHouly = new Date();
    this.datetimeMonth = new Date();
    this.StorageService.set('dayliDateSelected', this.formattedSelectedDataHourly)
    this.monthSelectes = this.datetimeMonth.getMonth() + 1;

    if((this.StorageService.get('tabActive') || '') != ''){
      this.tabIndicator = this.StorageService.get('tabActive')
      this.tabs = this.tabIndicator
    }else{
      this.StorageService.set('tabActive', 'hourly')
      this.tabs = 'hourly'
      this.tabIndicator = 'hourly'
    }

    if ((this.StorageService.get('products') || '').length == 0) {
      this.homeService.getProducts()
        .subscribe((products: Product) => {
          this.StorageService.set('products', JSON.stringify(products))
          this.products = this.productsInStore
          this.idProduct = this.productsInStore[0].id

          if(this.tabIndicator =='hourly'){
            this.getConsumptionsHourly(this.formattedSelectedDataHourly)
          }
          if(this.tabIndicator == 'month') {
            this.getConsumptionMonth(this.formattedSelectedDataMonth)
          }
        })
    } else {
      this.products = this.productsInStore
      this.idProduct = this.productsInStore[0].id
      if(this.tabIndicator == 'hourly'){
        this.getConsumptionsHourly(this.formattedSelectedDataHourly)
      }
      if(this.tabIndicator == 'month') {
        this.getConsumptionMonth(this.formattedSelectedDataMonth)
      }
    }

    this.mountMessage()
  }

  get ProductId(): number {
    return this.idProduct
  }

  get productsInStore(): Product[] {
    return JSON.parse(this.StorageService.get('products') || '')
  }

  get userName() {
    return this.StorageService.get('name')
  }

  get formattedSelectedDataHourly() {
    return formatDate(this.datetimeHouly, 'yyyy-MM-dd', 'en')
  }

  get formattedSelectedDataMonth() {
    return formatDate(this.datetimeMonth, 'yyyy-MM-dd', 'en')
  }

  get dateSelectedInStorage() {
    return this.StorageService.get('dayliDateSelected' || '')
  }

  get typesArray() {
    return Object.values(this.types)
  }

  dateSelect(event: any) {
    this.datetimeHouly = event.value
  }

  private mountMessage(): void {

    if (this.period <= 5 || this.period > 16) {
      this.msg = 'Boa Noite'
       return
    }
    if (this.period > 5 && this.period <= 12) {
      this.msg = 'Bom Dia'
      return
    }
    if (this.period > 12 && this.period <= 16) {
      this.msg = 'Boa Tarde'
      return
    }
  }

  private getConsumptionsHourly(date: string) {
    this.totalHourlyConsumptions = []
    this.$stateLoading.next(true)
    this.stateValuesConsumptions = true
    this.homeService.getConsumptionDay(date, this.ProductId)
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          this.utilService.showError(err.message)
          return of();
        }),
        map(consumption => {
          let sumKw: number = 0
          let sumMoney: number = 0
          consumption.consumptionsInKw.data.forEach(values => {
            sumKw = sumKw + values
          });
          consumption.consumptionsInMoney.data.forEach(values => {
            sumMoney = sumMoney + values
          });
          consumption.consumptionsInKw.total = sumKw
          consumption.consumptionsInMoney.total = sumMoney

          consumption.consumptionsInMoney.forecast = consumption.consumptionsInKw.average * 0.9

          return consumption
        })
      )
      .subscribe({
        next: (value: Consumption) => {
          this.totalHourlyConsumptions = []
          this.totalHourlyConsumptions.push(value.consumptionsInKw.total)
          this.totalHourlyConsumptions.push(value.consumptionsInMoney.total)
          this.stateButtonUpdate = false
          this.consumptionsHourlyValues = value

          if (this.typeConsumption == this.types.energy.description) {
            this.type.next(this.types.energy)
            this.$consumptionsHourly.next(value.consumptionsInKw)
            this.$totalValuesConsumptions.next(this.totalHourlyConsumptions)
            return
          }
          this.type.next(this.types.money)
          this.$consumptionsHourly.next(value.consumptionsInMoney)
          this.$totalValuesConsumptions.next(this.totalHourlyConsumptions)
        }
      })
  }

  private getConsumptionMonth(date: string) {
    this.totalMonthConsumptions = []
    this.$stateLoading.next(true)
    this.stateValuesConsumptions = true
    this.homeService.getConsumptionMonth(date, this.ProductId)
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          return of();
        }),

        map(consumption => {
          let sumKw: number = 0
          let sumMoney: number = 0
          consumption.consumptionsInKw.data.forEach(values => {
            sumKw = sumKw + values
          });
          consumption.consumptionsInMoney.data.forEach(values => {
            sumMoney = sumMoney + values
          });
          consumption.consumptionsInKw.total = sumKw
          consumption.consumptionsInMoney.total = sumMoney
          consumption.consumptionsInMoney.forecast = consumption.consumptionsInKw.average * 0.9
          return consumption
        })
      )
      .subscribe({
        next: (value: Consumption) => {
          console.log(value);

          this.totalMonthConsumptions.push(value.consumptionsInKw.total)
          this.totalMonthConsumptions.push(value.consumptionsInMoney.total)

          this.stateButtonUpdate = false
          this.consumptionsMonthValues = value
          if (this.typeConsumption == this.types.energy.description) {
            setTimeout(() => {
              this.type.next(this.types.energy)
              this.$consumptionsMonth.next(value.consumptionsInKw)
              this.$totalValuesConsumptions.next(this.totalMonthConsumptions)
            }, 500);
            return
          }
          setTimeout(() => {
            this.type.next(this.types.money)
            this.$consumptionsMonth.next(value.consumptionsInMoney)
            this.$totalValuesConsumptions.next(this.totalMonthConsumptions)
          }, 500);
        },

        error: (err: Error) => {
          this.utilService.showError(err.message)
          console.error(err);
        }
      })
  }

  typeSelect(event: string) {
    if(event == this.types.money.description && this.tabIndicator == 'hourly'){
      this.typeConsumption = event
      this.type.next(this.types.money)
      this.$consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      return
    }
    if(event == this.types.energy.description && this.tabIndicator == 'hourly'){
      this.typeConsumption = event
      this.type.next(this.types.energy)
      this.$consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInKw)
      return
    }
    if(event == this.types.money.description && this.tabIndicator == 'month'){
      this.typeConsumption = event
      this.type.next(this.types.money)
      this.$consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      return
    }
    if(event == this.types.energy.description && this.tabIndicator == 'month'){
      this.typeConsumption = event
      this.type.next(this.types.energy)
      this.$consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
      return
    }
  }

  selectMonth(monthNumber: number){
    const year: number = new Date().getFullYear()
    const day: number = new Date().getDate()
    const monthFormated = monthNumber.toString().length == 1 ? `0${monthNumber}` : monthNumber
    this.datetimeMonth = `${year}-${monthFormated}-${day}`
  }

  onClickUpdateData() {
    this.StorageService.set('dateSelectedMonth', this.formattedSelectedDataMonth)
    this.StorageService.set('dayliDateSelected', this.formattedSelectedDataHourly)
    this.stateButtonUpdate = true
    this.tabIndicator = this.StorageService.get('tabActive')
    if(this.tabIndicator == 'hourly'){
      this.stateButtonUpdate = true
      this.getConsumptionsHourly(this.formattedSelectedDataHourly)
      return
    }
    if(this.tabIndicator == 'month'){
      this.stateButtonUpdate = true
      this.getConsumptionMonth(this.formattedSelectedDataMonth)
      return
    }
  }

  onClickHourly() {
    this.StorageService.set('dayliDateSelected', formatDate(this.date, 'yyyy-MM-dd', 'en'))
    this.tabs = 'hourly'
    this.StorageService.set('tabActive', 'hourly')

    if (this.consumptionsHourlyValues) {
      console.log(this.consumptionsHourlyValues);

      if(this.typeConsumption == this.types.energy.description){
          setTimeout(() => {
            this.type.next(this.types.energy)
            this.$consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInKw)
            this.$totalValuesConsumptions.next(this.totalHourlyConsumptions)
          }, 500);
        return
      }
      setTimeout(() => {
        this.type.next(this.types.money)
        this.$consumptionsHourly.next(this.consumptionsHourlyValues.consumptionsInMoney)
        this.$totalValuesConsumptions.next(this.totalHourlyConsumptions)
      }, 500);
;
    } else {
      this.getConsumptionsHourly(this.formattedSelectedDataHourly)
    }
  }

  onClickMonth() {
    this.tabs = 'month'
    this.StorageService.set('tabActive', 'month')
    this.StorageService.set('dateSelectedMonth', this.formattedSelectedDataMonth)
    if (this.consumptionsMonthValues) {
      if(this.typeConsumption == this.types.energy.description){
        setTimeout(() => {
          this.type.next(this.types.energy)
          this.$consumptionsMonth.next(this.consumptionsMonthValues.consumptionsInKw)
          this.$totalValuesConsumptions.next(this.totalMonthConsumptions)
        }, 500);
        return
      }
      setTimeout(() => {
        this.type.next(this.types.money)
        this.$consumptionsMonth.next(this.consumptionsMonthValues.consumptionsInMoney),
        this.$totalValuesConsumptions.next(this.totalMonthConsumptions)
      }, 500);
    } else {
      this.getConsumptionMonth(this.formattedSelectedDataMonth)
    }
  }

  onClickRealtime() {
    this.tabs = 'realtime'
    this.StorageService.set('tabActive', 'realtime')
    this.homeService.conect()
  }

  onClickConnectRealtime(){
    this.$connetSocket.next(true)
  }

}

import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../pages/home/home.service';
import { ConsumptionSokect } from 'src/shared/interfaces/consumptions.-interface';
import { map } from 'rxjs';
import { PaginaInicialComponent } from '../pagina-inicial/pagina-inicial.component';

@Component({
  selector: 'app-dashboard-tempo-real',
  templateUrl: './dashboard-tempo-real.component.html',
  styleUrls: ['./dashboard-tempo-real.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class DashboardTempoRealComponent implements OnInit {
  @Inject(MAT_DATE_LOCALE) private _locale: string | undefined = 'pt-BR';
  @ViewChild('canva', { static: true }) element!: ElementRef;
  chartJS!: Chart;
  energyType!: string;
  moneyType!: string;
  hours!: string[];
  consumptions!: ConsumptionSokect[];
  cpflQuota: number = 0.9;

  types = [
    { description: 'Energia', value: '1', icon: 'electric_bolt', type: 'Khw' },
    { description: `Dinheiro`, value: '2', icon: 'payments', type: 'R$' },
  ];

  date = new Date();

  get isConnected(): boolean {
    return this.dashService.isConnected;
  }

  constructor(
    private _adapter: DateAdapter<any>,
    private dashService: DashboardService,
    private pageInitial: PaginaInicialComponent
  ) {
    this.dashService.conect();
  }

  ngOnInit(): void {
    this._adapter.setLocale(this._locale);

    this.pageInitial.$connetSocket.subscribe({
      next: (connection: boolean) => {
        if (connection == true) return this.conectSocket();
      },
    });

    this.dashService.dataSocket.subscribe({
      next: (consumptions: any) => {
        setTimeout(() => {
          this.addDataCharts(
            consumptions.labels,
            consumptions.dataKw,
            consumptions.dataMoney
          );
        }, 1000);
      },
    });
  }

  private conectSocket() {
    this.dashService.conect();
  }

  ngAfterContentInit(): void {
    this.initChart();
  }

  private initChart() {
    this.chartJS = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i: number) => {
          const hour = i;
          const isTwoDigits = hour.toString().length > 1;
          const formattedHour = isTwoDigits ? `${hour}:00` : `0${hour}:00`;
          return formattedHour;
        }),
        datasets: [
          {
            label: 'Dinheiro R$',
            data: [],
            borderWidth: 4,
            borderColor: '#4bb774',
            borderCapStyle: 'round',
            backgroundColor: '#4bb77477',
            fill: true,
          },
          {
            label: 'Energia kWh',
            data: [],
            borderWidth: 4,
            borderColor: '#4551B5',
            backgroundColor: '#4550b562',
            borderCapStyle: 'round',
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
      },
    });
  }

  private addDataCharts(
    labels: string[],
    dataKw: number[],
    dataKwInMoney: any[]
  ) {
    this.chartJS.data.datasets[0].data = dataKwInMoney;
    this.chartJS.data.datasets[1].data = dataKw;
    this.chartJS.data.labels = labels;
    this.chartJS.update();
  }

  ngOnDestroy(): void {
    this.dashService.disconnect();
  }
}

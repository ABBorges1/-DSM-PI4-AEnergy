import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import {
  Consumption,
  ConsumptionSokect,
} from 'src/shared/interfaces/consumptions.-interface';
import { Product } from 'src/shared/interfaces/product-interface';
import { StorageService } from 'src/util/storage.service';
import { io, Socket } from 'socket.io-client';
import { formatDate } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',

})
export class DashboardService {
  private socket!: Socket;
  private _isConnected: boolean = false;
  consumptionsInKw: number[] = [];
  consumptionsInMoney: number[] = [];
  consumptionHouly: string[] = [];
  dataSocket: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  get productsIdInStore(): Product[] {
    const products = JSON.parse(this.storageService.get('products') || '');
    return products[0].id;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  public getConsumptionDay(
    date: string,
    idProduct: number
  ): Observable<Consumption> {
    return this.http.get<Consumption>(
      `${enviremonet.API_URL}/products/${idProduct}/consumptions?type=hourly&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  public getConsumptionMonth(
    date: string,
    idProduct: number
  ): Observable<Consumption> {
    return this.http.get<Consumption>(
      `${enviremonet.API_URL}/products/${idProduct}/consumptions?type=daily&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  public getProducts(): Observable<Product> {
    return this.http.get<Product>(`${enviremonet.API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  get token() {
    return this.storageService.get('token');
  }

  public conect(): void {
    const payload = { productId: this.productsIdInStore };

    this.socket = io(`${enviremonet.API_URL}/products`);
    this.socket.on('connect', () => {
      this._isConnected = true;
      this.socket.on('products:new-consumption', (consumption) => {
        this.mountPayload(consumption);
        this.addDataChart();
      });

      this.socket.emit(
        'products:subscribe-consumptions',
        payload,
        (consumptions: ConsumptionSokect[]) => {
          this.consumptionsInKw,
            this.consumptionsInMoney,
            (this.consumptionHouly = []);
          for (let i = consumptions.length - 1; i > 0; i--) {
            this.mountPayload(consumptions[i]);
          }
          this.addDataChart();
        }
      );
    });

    this.socket.on('connect_error', (error) => {
      console.error(error);
      this._isConnected = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.error('socket disconnected: ', reason);
      this._isConnected = false;
    });
  }

  public disconnect(): void {
    this._isConnected = false;
    this.socket.disconnect();
  }

  private mountPayload(data: ConsumptionSokect) {
    this.consumptionsInKw.push(data.kwm);
    this.consumptionsInMoney.push(data.kwInMoney);
    const hoursString = formatDate(data.kwmDate, 'hh:mm', 'en')
    this.consumptionHouly.push(hoursString);
  }

  addDataChart(): void {
    const allDataConsumptions = {
      labels: this.consumptionHouly,
      dataKw: this.consumptionsInKw,
      dataMoney: this.consumptionsInMoney,
    };
    this.dataSocket.next(allDataConsumptions);
  }
}

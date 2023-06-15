import { Parser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Consumption } from 'src/shared/interfaces/consumptions.-interface';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  get(key: string){
    return localStorage.getItem(key)
  }

  set(key: string, value: string){
    return localStorage.setItem(key, value)
  }

  remove(key: string){
    return localStorage.removeItem(key)
  }

  clear(){
    localStorage.clear()
  }
}

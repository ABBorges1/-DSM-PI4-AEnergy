import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';
import { SettingsService } from './settings.service';
import { catchError, of } from 'rxjs';
import { Product } from 'src/shared/interfaces/product-interface';
import { Router } from '@angular/router';
import {UserInfo} from '../../../shared/interfaces/user-interface'
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  products: any = []
  userInfo: any = []
  liberado: boolean = false

  constructor(
    private storage: StorageService,
    private settingsService: SettingsService,
    private router: Router,
    private dialog: MatDialog
  ){
    this.ProductInfoStorage()
    this.userInfoStorage()
  }

  ngOnInit(): void {

  }

  ProductInfoStorage(){
    const NameProduct = this.storage.get('nameProduct')
    const UUID = this.storage.get('uuidProduct')

    if(!NameProduct || !UUID){
      // this.searchProducts(this.storage.get('idUser'))
      return
    }
    else{
      this.products = []
      this.products.push({
        NameProduct,
        UUID
      })
    }
  }

  searchProducts(id: string | null): void{
    this.settingsService.searchProduct(id)
      .subscribe(async res => {
        await this.storage.set('uuidPorduct', res[0].UUID)
        await this.storage.set('nameProduct', res[0].NameProduct)
        this.ProductInfoStorage()
      })
  }

  userInfoStorage(){
    const Email = this.storage.get('login')
    const Name = this.storage.get('name')

    if(this.userInfo.length === 0){
      this.userInfo.push({
        Name,
        Login: Email
      })
    }
  }

  searchUser(id: string | null){
    this.settingsService.searchInfosUser(id)
      .subscribe(res => {
        this.storage.set('name', res[0].Name)
        this.storage.set('email', res[0].Login)
        this.userInfoStorage()
      })
  }

  goToEditUser(){
    this.dialog.open(EditUserComponent, {
      width: '500px',
      height: '450px'
    })
    // this.router.navigateByUrl("home/edit-user")
  }
}


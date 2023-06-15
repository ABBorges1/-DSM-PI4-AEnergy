import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  state: boolean = false
  hours: number = new Date().getHours()
  themeIcon = 'light_mode'


  constructor(
    private router: Router,
    private storage: StorageService,
    private utilService: UtilService
  ) { }

  ngOnInit(): void {

  }

  toggleMode(){
    document.body.classList.toggle('dark-theme')
    if(this.themeIcon == 'light_mode'){
      this.themeIcon = 'dark_mode'
    }else{
      this.themeIcon = 'light_mode'
    }
  }

  logOut(){
    this.storage.clear()
    this.router.navigate(['login'])
  }
}

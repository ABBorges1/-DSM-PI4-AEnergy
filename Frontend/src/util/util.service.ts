import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    private toastrService: ToastrService,
  ) { }

  showSucess(msg: string){    
    this.toastrService.success(msg)
  }

  showError(msg: string){
    this.toastrService.error(msg)
  }
}

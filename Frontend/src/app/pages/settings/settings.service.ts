import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private utilService: UtilService
  ) { }

  searchProduct(id: string | null): Observable<any>{
    let token = this.storage.get('token')

    return this.http.get<any>(`${enviremonet.API_URL}/product/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(err => {
        if(err.error.error == 'Unauthorized'){
          this.utilService.showError('Sem autorização')
        }
        if(err.status !== 401 && err.status !== 404 ){
          this.utilService.showError('Ops, erro no servidor')
        }
        console.log(err);
        return of([])
      })
    )
  }

  searchInfosUser(id: string | null){
    let token = this.storage.get('token')

    return this.http.get<any>(`${enviremonet.API_URL}/user/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

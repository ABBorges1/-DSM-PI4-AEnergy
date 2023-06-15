import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviremonet } from 'src/enviremonents/enviromenents';
import { User } from 'src/shared/interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  registerUser(user: User): Observable<any>{
    return this.http.post<any>(`${enviremonet.API_URL}/user`, user)
  }
}

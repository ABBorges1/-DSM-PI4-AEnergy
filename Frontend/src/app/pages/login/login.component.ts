import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { UtilService } from 'src/util/util.service';
import { StorageService } from 'src/util/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password: string = 'password';
  form!: FormGroup;
  state: boolean = false


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog,
    private utilService: UtilService,
    private storageService: StorageService

  ) { }

  ngOnInit(): void {
    this.initialForms();
  }

  initialForms(){
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  getFormsErros(control: string){
    if(this.form.controls[control].hasError('required')){
      return 'Campo obrigatório'
    }
    if(this.form.controls[control].hasError('email')){
      return 'Email invalido'
    }
    return
  }

  async login(){
    this.state = true
    const payload ={
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    }

    await this.loginService.loginSubbimit(payload).pipe(
      catchError(err => {
        if(err.status === 404 || err.status === 401) this.utilService.showError(err.error.msg)
        if(err.status !== 404 || err.status === 401) this.utilService.showError('Ops, erro no servidor')
        this.state = false
        return throwError(() => err)})
    )
    .subscribe(data => {
      this.setLocalStorage(data)
      this.singIn()
      this.state = false
    })

  }

  setLocalStorage(user: any){
    this.storageService.set('login', user.user)
    this.storageService.set('name', user.name)
    this.storageService.set('token', user.token)
  }

  singIn(){
    this.router.navigate(['home'])
  }

  openDialogRegister(){
    this.dialog.open(RegisterComponent, {
      width: '400px',
      height: '450px'
    })
  }

}

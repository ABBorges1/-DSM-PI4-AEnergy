import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { RegisterService } from './register.service';
import { catchError, throwError } from 'rxjs';
import { UtilService } from 'src/util/util.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  password: string = 'password';
  form!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialForms();
  }

  initialForms(){
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  async register(){
    const payload ={
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      name: this.form.controls['name'].value
    }

    await this.registerService.registerUser(payload).pipe(
      catchError(err => {
        this.utilService.showError(err.error.msg)
        return throwError(() => err)
      })
    )
    .subscribe( data =>{
      this.utilService.showSucess(data.msg)
      setTimeout(() =>{
        this.dialog.closeAll()
      }, 1500)
    })
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/util/storage.service';
import { UtilService } from 'src/util/util.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  password: string = 'password';
  form!: FormGroup;
  userInfos: any

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private sotage : StorageService
  ) { }

  ngOnInit(): void {
    this.initialForms();
    this.userInfosStorage()
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
  }

  userInfosStorage(){
    const NameUser = this.sotage.get('name')
    const Email = this.sotage.get('login')

    this.userInfos = {
      NameUser,
      Email
    }
  }
}

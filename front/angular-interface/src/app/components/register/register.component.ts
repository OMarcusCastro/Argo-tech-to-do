import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validateHeaderName } from 'http';
import { ApiService } from '../../services/api.service';
import { Router,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  providers: [ApiService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerFrom: FormGroup;

  constructor(private apiService: ApiService,private router:Router) {
    this.registerFrom = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
      ]),
      confirmPassword: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  register() {
    console.log('entrou')
    if (this.registerFrom.value.password.length < 8) {
      alert('Senha muito curta,min 8 caracteres')
      console.log('senha curta')
      return
    }
    if (this.registerFrom.value.email.length < 3) {
      alert('Email muito curto, tem que ser maior que 3 caracteres')
      console.log('email curto')
      return
    }
    if (this.registerFrom.valid) {
      if(this.registerFrom.value.password != this.registerFrom.value.confirmPassword){

        alert('Senhas incompativeis')
        console.log("senha errada")
        return
      }
      this.apiService.sendRegister(
        this.registerFrom.value.email,
        this.registerFrom.value.password,
        this.registerFrom.value.username
      ).subscribe({
        next:(data:any)=>{
          this.apiService.setToken(data.access_token)

          console.log("data:",data)
          localStorage.setItem('token',data.access_token)
          localStorage.setItem('user_id',data.user_id)
          this.registerFrom.reset()
          this.router.navigate(['/list'])
        },
        error:(error)=>{
          error=error.error
          if(error.email){
            alert(error.email)
          }
          console.log('erro ao fazer login',error.error)
        }
      })




    }
  }
}

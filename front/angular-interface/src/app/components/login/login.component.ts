
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SharedModuleComponent } from '../shared-module/shared-module.component';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, RouterLink,SharedModuleComponent],
  providers :[ApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm:FormGroup

  constructor(private apiService:ApiService,
    private router:Router){
    this.loginForm=new FormGroup({
      email:new FormControl("",[Validators.email,Validators.required]),
      password:new FormControl("",[Validators.minLength(8),Validators.required])
    })
  }

  login(){
    console.log(this.loginForm.value)

    if (this.loginForm.valid){
      const response=this.apiService.sendLogin(this.loginForm.value.email,
        this.loginForm.value.password).subscribe({
          next:(token:string)=>{

            localStorage.setItem("token",token)
            this.apiService.setToken(token)
            this.apiService.token = token

            console.log("token login",)
            this.apiService.getUserID(token).subscribe({
              next: (data)=>{
                this.apiService.user_id.set(data.user_id)
                localStorage.setItem("user_id",data.user_id)
                console.log("data",data.user_id)
              }
            })
            this.loginForm.reset()
            this.router.navigate(['/list'])

          },
          error:(error)=>{
            console.log('erro ao fazer login',error)
          }
        })


      console.log(response)

    }

  }
}

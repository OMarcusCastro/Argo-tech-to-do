
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, RouterLink],
  providers :[ApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm:FormGroup

  constructor(private apiService:ApiService){
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
            console.log(token)
            this.apiService.getUserID(token).subscribe({
              next: (user_id:number)=>{
                console.log(user_id)
              }
            })
            this.loginForm.reset()
          },
          error:(error)=>{
            console.log('erro ao fazer login',error)
          }
        })


      console.log(response)
    }

  }
}

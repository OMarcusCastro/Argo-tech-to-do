import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validateHeaderName } from 'http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerFrom: FormGroup;

  constructor(private apiService: ApiService) {
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
        next:()=>{
          this.registerFrom.reset()
        }
      })


    }
  }
}

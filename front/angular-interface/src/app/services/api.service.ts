import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse.interface';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private endpointUrl = "http://127.0.0.1:8000/"
  constructor(private http:HttpClient) { }


  sendLogin(email:String,password:String):Observable<LoginResponse>{
    const data = {email,password}

    const response = this.http.post<LoginResponse>(`${this.endpointUrl}/user/login/`,data)
    console.log(response)
    return response

  }

  sendRegister(email:String,password:string,username:string):Observable<LoginResponse>{
    const data = {email,password,username}

    const response = this.http.post<LoginResponse>(`${this.endpointUrl}/user/register/`,data)

    return response
  }
}

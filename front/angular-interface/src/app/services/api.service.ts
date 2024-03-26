import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse.interface';
import { response } from 'express';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private endpointUrl = 'http://127.0.0.1:8000';
  user_id = signal(0)
  token:string = ""
  task_list = signal("")




  constructor(private http: HttpClient,private cookieService :CookieService) {
    console.log('liguei')
  }

  setToken(token: string) {
    // Define o cookie com o nome 'access_token' e o valor do token

    console.log("token setado",token)
    this.cookieService.set('access_token', token);
  }

  // Método para obter o token do cookie
  getToken(): string {
    // Retorna o valor do cookie com o nome 'access_token'
    return this.cookieService.get('access_token');
  }


  getTasks(token:string){
    this.token = localStorage.getItem("token") ||''
    console.log(this.token)

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.get<any>(`${this.endpointUrl}/list/`, { headers })

  }

  getUserID(token:String): Observable<any> {
    // Recupera o access_token dos cookiess
    // this.token = token


    // Cria os headers da requisição
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    // Faz a requisição GET para /user/ com os headers incluindo o access_token
    return this.http.get<any>(`${this.endpointUrl}/user/`, { headers });
  }

  sendLogin(email: String, password: String): Observable<string> {
    const data = { email, password };

    // return this.http.post<LoginResponse>(`${this.endpointUrl}/user/login/`, data)
    return this.http
      .post<LoginResponse>(`${this.endpointUrl}/user/login/`, data)
      .pipe(
        map((loginResponse: LoginResponse) => loginResponse.access_token)
      );
  }

  sendRegister(
    email: String,
    password: string,
    username: string
  ): Observable<LoginResponse> {
    const data = { email, password, username };

    const response = this.http.post<LoginResponse>(
      `${this.endpointUrl}/user/register/`,
      data
    )

    return response
  }

  updateTask(task:any){
    this.token=localStorage.getItem("token")||"token undefined"
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.put<any>(`${this.endpointUrl}/update/`, task, { headers })

  }

  deleteTask(id:number){
    this.token=localStorage.getItem("token")||"token undefined"
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    const data = {id}


    return this.http.post<any>(`${this.endpointUrl}/delete/`, data,{ headers })

  }




}

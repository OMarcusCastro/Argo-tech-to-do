import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse.interface';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private endpointUrl = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) {}

  getUserID(token:String): Observable<any> {
    // Recupera o access_token dos cookies


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
    ).pipe(
      map((loginResponse: LoginResponse) => loginResponse)
    );

    return response
  }


  // Função auxiliar para recuperar o cookie pelo nome
  private getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const token = parts.pop()?.split(';').shift() || ' ';
    if (parts.length === 2) return token;
    return '';
  }
}

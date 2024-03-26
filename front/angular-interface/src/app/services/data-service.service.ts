import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  token:string = ''
  constructor() {
    console.log(this.token)
   }
}

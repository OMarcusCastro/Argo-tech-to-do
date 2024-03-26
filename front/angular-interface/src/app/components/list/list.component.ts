
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { cp } from 'node:fs';
import { SharedModuleComponent } from '../shared-module/shared-module.component';
import { app } from '../../../../server';
import { TaskComponent } from '../task/task.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, SharedModuleComponent,TaskComponent],
  providers : [ApiService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  tasks:any[]=[];
  constructor(private apiService:ApiService,
    private router:Router) {

    const token = localStorage.getItem('token')||""

    if (token === ""){
      alert("Você não está logado")
      this.router.navigate(['/login'])
    }

    console.log("token aquiii",token)
    this.apiService.getTasks(token).subscribe(
      (tasks)=>this.tasks=tasks
    )
  }


  ngOnInit(): void {
    // const token:string = localStorage.getItem('token')||""
    const token:string = this.apiService.getToken()
    this.apiService.getTasks(token).subscribe(
      (tasks)=>this.tasks=tasks
      )

  }


  logout(){
    this.apiService.sendlogout().subscribe({
      next: (response) => {
        console.log(response)
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        window.location.href = '/login'
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onCreate(){
    this.router.navigate(['/create'])
  }


}

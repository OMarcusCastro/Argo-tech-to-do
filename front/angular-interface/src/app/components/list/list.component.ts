
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { cp } from 'node:fs';
import { SharedModuleComponent } from '../shared-module/shared-module.component';
import { app } from '../../../../server';
import { TaskComponent } from '../task/task.component';

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
  constructor(private apiService:ApiService) {

    const token = this.apiService.token
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


}

import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  providers:[ApiService],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task: any;
  @Input() anterior:number=0;

  constructor(private apiService: ApiService) {}

  showButtonsMap: { [taskId: string]: boolean } = {};

  toggleButtons(taskId: string, show: boolean) {
    this.showButtonsMap[taskId] = show;
  }

  checkboxChanged(id: number,task:any) {
    // Aqui você tem acesso ao ID e à tarefa ou sub-tarefa que teve o checkbox alterado
    console.log('Checkbox changed', id, task);

    if (task.status=='completed'){
      task.status = 'pending'
    }else{
      task.status = 'completed'
    }


    this.apiService.updateTask(task).subscribe({
      next: (response) => {
        console.log('Task updated', response);
      },
      error: (error) => {
        console.error('Error updating task', error);
      },
    })
  }

  onDelete(id:number){
    console.log('deletando',id)
    this.apiService.deleteTask(id).subscribe({
      next: (response) => {
        console.log('Task deleted', response);
        window.location.reload()
      },
      error: (error) => {
        console.error('Error deleting task', error);
      },
    })
  }

 makeSubtask(task:any){
    if(task.parent_task){
      alert('Você não pode criar uma sub-tarefa para uma sub-tarefa')
      return
    }
    if(!this.anterior){
      alert("erro")
      return
    }
    console.log(this.anterior)
    task.parent_task= this.anterior

    this.apiService.updateTask(task).subscribe({
      next: (response) => {
        console.log('Task updated', response);
        window.location.reload()
      },
      error: (error) => {
        console.error('Error updating task', error);
      },
    })

 }
}

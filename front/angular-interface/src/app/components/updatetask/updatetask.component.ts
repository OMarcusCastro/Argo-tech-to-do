import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updatetask',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './updatetask.component.html',
  styleUrl: './updatetask.component.scss'
})
export class UpdatetaskComponent implements OnInit{
  @Input() task: any;

  updateTask: FormGroup = new FormGroup({});



  constructor(private apiService: ApiService, private router: Router) {
  }
  ngOnInit(): void {
    console.log('ola', this.task); // Aqui a tarefa já terá sido definida

    this.updateTask = new FormGroup({
      title: new FormControl(this.task.title, [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl(this.task.description, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  saveTask() {
    const data = {...this.updateTask.value, id: this.task.id};
    this.apiService.updateTask(data).subscribe({
      next: (response) => {
        console.log('Task updated', response);
      },
      error: (error) => {
        console.error('Error updating task', error);
      },
    });

    window.location.reload()
  }

  voltar() {

    window.location.reload()
    this.router.navigate(['/list']);
  }
}

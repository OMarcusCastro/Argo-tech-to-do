import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newtask',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './newtask.component.html',
  styleUrl: './newtask.component.scss',
})
export class NewtaskComponent {
  newTask: FormGroup;

  constructor(private apiService: ApiService, private router: Router) {
    this.newTask = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  save() {
    console.log(this.newTask.value);
    const data = {
      ...this.newTask.value,
      user: parseInt(localStorage.getItem('user_id') || ''),
      status: 'pending',
      parent_task: '',
    };

    if (this.newTask.valid) {
      this.apiService.sendTask(data).subscribe({
        next: (data) => {
          console.log('task saved', data);
          this.router.navigate(['/list']);
        },
        error: (error) => {
          alert('Erro ao salvar task');
          console.log('erro ao salvar task', error);
        },
      });
    }
  }
  voltar() {
    this.router.navigate(['/list']);
  }
}

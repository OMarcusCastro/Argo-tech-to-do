import { CommonModule } from '@angular/common';
import { ApiService } from './../../services/api.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shared-module',
  standalone: true,
  imports: [CommonModule],
  providers: [ApiService],
  templateUrl: './shared-module.component.html',
  styleUrl: './shared-module.component.scss'
})
export class SharedModuleComponent {
  constructor(private apiService: ApiService) {}
}

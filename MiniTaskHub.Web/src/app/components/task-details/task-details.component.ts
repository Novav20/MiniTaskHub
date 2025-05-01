import { Component, OnInit } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-task-details',
  imports: [TaskCardComponent, MatCardModule, MatProgressSpinner, MatButton, RouterModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  errorMessage: string | null = null;
  constructor(private route: ActivatedRoute, private tasksService: TasksService) { }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tasksService.getTaskById(id).subscribe({
      next: (data: Task) => {
        this.task = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }
}

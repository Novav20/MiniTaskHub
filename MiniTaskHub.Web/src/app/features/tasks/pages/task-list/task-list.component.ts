import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  
  tasks: TaskItem[] = [];

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks: TaskItem[]) => {
        this.tasks = tasks;
        console.log('Tasks loaded:', this.tasks);
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
      }
    });
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem } from '../../../../core/models/task.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../../../../shared/components/task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  
  tasks: TaskItem[] = [];
  isCardView: boolean = true;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks: TaskItem[]) => {
        this.tasks = tasks;
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  viewTaskDetails(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  deleteTask(id: number): void {
    console.log('Delete task:', id);
    // Implement delete logic with confirmation
  }
}
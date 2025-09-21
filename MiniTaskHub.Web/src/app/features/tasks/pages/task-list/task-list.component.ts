import { Component, inject, OnInit } from '@angular/core';
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
  
  tasks: TaskItem[] = [];
  isCardView: boolean = true;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
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

  // Placeholder methods for actions
  editTask(id: number): void {
    console.log('Edit task:', id);
    // Implement navigation to edit form
  }

  viewTaskDetails(id: number): void {
    console.log('View task details:', id);
    // Implement navigation to task details page
  }

  deleteTask(id: number): void {
    console.log('Delete task:', id);
    // Implement delete logic with confirmation
  }
}
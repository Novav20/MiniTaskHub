import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem } from '../../../../core/models/task.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../../../../shared/components/task-card/task-card.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, ConfirmDialogComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  @ViewChild('deleteConfirmDialog') private dialog!: ConfirmDialogComponent;

  private taskService = inject(TaskService);
  private router = inject(Router);

  tasks: TaskItem[] = [];
  isCardView: boolean = true;
  taskToDeleteId: number | null = null;

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
    this.taskToDeleteId = id;
    this.dialog.show();
  }

  onDeleteConfirm(): void {
    if (this.taskToDeleteId) {
      this.taskService.deleteTask(this.taskToDeleteId).subscribe({
        next: () => {
          // Refresh the list or remove the item from the array
          this.tasks = this.tasks.filter(t => t.id !== this.taskToDeleteId);
          this.taskToDeleteId = null;
        },
        error: (err) => {
          console.error('Error deleting task', err);
          // Optionally, show an error message to the user
          this.taskToDeleteId = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.taskToDeleteId = null;
  }
}

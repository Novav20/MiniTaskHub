import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem, TaskItemStatus } from '../../../../core/models/task.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../../../../shared/components/task-card/task-card.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEye, faEdit, faTrash, faTable, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { TaskEditModalComponent } from '../../../../shared/components/task-edit-modal/task-edit-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, ConfirmDialogComponent, FontAwesomeModule, TaskEditModalComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  @ViewChild('deleteConfirmDialog') private dialog!: ConfirmDialogComponent;
  @ViewChild('taskEditModal') taskEditModal!: TaskEditModalComponent;

  private taskService = inject(TaskService);
  private router = inject(Router);

  // Icons
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faTable = faTable;
  faIdCard = faIdCard;

  tasks: TaskItem[] = [];
  isCardView: boolean = true;
  taskToDeleteId: number | null = null;
  selectedTaskForEdit: TaskItem | null = null;

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

  getBadgeClass(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.Pending:
        return 'text-bg-secondary';
      case TaskItemStatus.InProgress:
        return 'text-bg-primary';
      case TaskItemStatus.Done:
        return 'text-bg-success';
      default:
        return 'text-bg-light';
    }
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  editTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task: TaskItem) => {
        this.selectedTaskForEdit = { ...task }; // Create a copy to avoid direct mutation
        this.taskEditModal.show();
      },
      error: (err) => {
        console.error('Error loading task for edit:', err);
      }
    });
  }

  onTaskSaved(updatedTask: TaskItem): void {
    // Update the task in the local array
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
    this.taskEditModal.hide();
    this.selectedTaskForEdit = null;
  }

  onTaskEditCanceled(): void {
    this.taskEditModal.hide();
    this.selectedTaskForEdit = null;
  }

  viewTaskDetails(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  deleteTask(id: number): void {
    this.taskToDeleteId = id;
    
    // Use setTimeout to ensure the dialog is properly initialized before showing it
    setTimeout(() => {
      try {
        this.dialog.show();
      } catch (error) {
        console.error('Error showing dialog:', error);
      }
    });
  }

  onDeleteConfirm(): void {
    if (this.taskToDeleteId) {
      const taskIdToDelete = this.taskToDeleteId;
      
      // Hide the dialog first
      try {
        this.dialog.hide();
      } catch (error) {
        console.error('Error hiding dialog:', error);
      }
      
      this.taskService.deleteTask(taskIdToDelete).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== taskIdToDelete);
          this.taskToDeleteId = null;
        },
        error: (err) => {
          console.error('Error deleting task', err);
          this.taskToDeleteId = null;
        }
      });
    } else {
      try {
        this.dialog.hide();
      } catch (error) {
        console.error('Error hiding dialog in onDeleteConfirm:', error);
      }
    }
  }

  onDeleteCancel(): void {
    this.taskToDeleteId = null;
    
    // Ensure the dialog is properly hidden
    try {
      this.dialog.hide();
    } catch (error) {
      console.error('Error hiding dialog in onDeleteCancel:', error);
    }
  }
}

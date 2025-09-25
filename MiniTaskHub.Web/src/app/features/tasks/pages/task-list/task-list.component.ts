import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem, TaskItemStatus } from '../../../../core/models/task.model';
import { TasksRepository } from '../../../../core/state/tasks.repository';

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
  private tasksRepository = inject(TasksRepository);

  // Icons
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faTable = faTable;
  faIdCard = faIdCard;

  tasks$: Observable<TaskItem[]> = this.tasksRepository.tasks$;
  isCardView: boolean = true;
  taskToDeleteId: number | null = null;
  selectedTaskForEdit: TaskItem | null = null;

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    // This call triggers the HTTP request. 
    // The service updates the store, and the component gets updates from the tasks$ observable.
    this.taskService.getAllTasks().subscribe({
      error: (err: any) => {
        console.error('Error loading tasks:', err); // Keep error logging for now
      }
    });
  }

  getBadgeClass(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.Pending:
        return 'badge-glass-pending';
      case TaskItemStatus.InProgress:
        return 'badge-glass-in-progress';
      case TaskItemStatus.Done:
        return 'badge-glass-done';
      default:
        return 'badge-glass-pending'; // A sensible default
    }
  }

  getBadgeText(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.InProgress:
        return 'In Progress';
      default:
        return status; // For Pending, Done, etc., return as is
    }
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  toggleView(): void {
    this.isCardView = !this.isCardView;
  }

  editTask(id: number): void {
    // Get the task from the store
    this.tasksRepository.getTask(id).subscribe(task => {
      if (task) {
        this.selectedTaskForEdit = { ...task }; // Create a copy
        this.taskEditModal.show();
      } else {
        // Optional: fetch from service if not in store, for robustness
        console.error('Task not found in store, consider fetching from API');
      }
    }).unsubscribe(); // We only need the current value, so we unsubscribe immediately.
  }

  onTaskSaved(updatedTask: TaskItem): void {
    // The service now updates the store, so this manual update is no longer needed.
    // The tasks$ observable will automatically emit the new state.
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
    setTimeout(() => this.dialog.show());
  }

  onDeleteConfirm(): void {
    if (this.taskToDeleteId) {
      this.dialog.hide();
      this.taskService.deleteTask(this.taskToDeleteId).subscribe({
        next: () => {
          // The store is now the source of truth, no need to filter the local array.
          this.taskToDeleteId = null;
        },
        error: (err) => {
          console.error('Error deleting task', err);
          this.taskToDeleteId = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.taskToDeleteId = null;
    this.dialog.hide();
  }
}
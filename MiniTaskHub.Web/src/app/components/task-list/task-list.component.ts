import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { TaskStatus } from '../../models/task-status.enum';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

const COMPACT_VIEW_KEY = 'taskList.compactView';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    TaskCardComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  errorMessage: string | null = null;
  loading = false;
  taskStatusOptions = Object.values(TaskStatus);
  statusFilter: string = '';
  dueDateFilter: string = '';
  sortBy: string = 'dueDate';
  sortOrder: string = 'asc';
  compactView: boolean = false;

  constructor(
    private tasksService: TasksService,
    private shared: SharedService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Load persisted compactView preference
    const persisted = localStorage.getItem(COMPACT_VIEW_KEY);
    if (persisted !== null) {
      this.compactView = persisted === 'true';
    }
    this.loading = true;
    this.tasksService.getTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  setCompactView(value: boolean) {
    this.compactView = value;
    localStorage.setItem(COMPACT_VIEW_KEY, String(value));
  }

  viewTask(id: number) {
    this.router.navigate(['/tasks', id]);
  }
  createTask() {
    this.shared.setTaskToEdit(null);
    this.router.navigate(['/create']);
  }

  @Output() editRequested = new EventEmitter<Task>();
  editTask(task: Task) {
    this.shared.setTaskToEdit(task);
    this.router.navigate(['/edit/', task.id]);
  }

  deleteTask(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this task? This action cannot be undone.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed, proceed with deletion
        this.tasksService.deleteTask(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.loading = false;
          }
        });
      }
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  get filteredTasks() {
    let filtered = this.tasks.filter(task => {
      const statusMatch = !this.statusFilter || task.status === this.statusFilter;
      const dueDateMatch = !this.dueDateFilter || task.dueDate <= this.dueDateFilter;
      return statusMatch && dueDateMatch;
    });

    if (this.sortBy === 'title') {
      filtered = filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'dueDate') {
      filtered = filtered.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    }

    if (this.sortOrder === 'desc') {
      filtered = filtered.reverse();
    }

    return filtered;
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date('2025-05-03'); // Use current date context
    return due < now && task.status !== 'Done';
  }

  isDueSoon(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date('2025-05-03');
    const soon = new Date(now);
    soon.setDate(now.getDate() + 3); // Next 3 days
    return due >= now && due <= soon && task.status !== 'Done';
  }
}

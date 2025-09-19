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

/**
 * Component for displaying a list of tasks.
 */
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
  /**
   * The list of tasks.
   */
  tasks: Task[] = [];
  /**
   * Error message to display to the user.
   */
  errorMessage: string | null = null;
  /**
   * Whether the component is in a loading state.
   */
  loading = false;
  /**
   * The options for the task status filter.
   */
  taskStatusOptions = Object.values(TaskStatus);
  /**
   * The current status filter.
   */
  statusFilter = '';
  /**
   * The current due date filter.
   */
  dueDateFilter = '';
  /**
   * The current sort by option.
   */
  sortBy = 'dueDate';
  /**
   * The current sort order.
   */
  sortOrder = 'asc';
  /**
   * Whether to display the tasks in a compact view.
   */
  compactView = false;

  constructor(
    private tasksService: TasksService,
    private shared: SharedService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  /**
   * Initializes the component.
   */
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

  /**
   * Sets the compact view.
   * @param value Whether to use the compact view.
   */
  setCompactView(value: boolean) {
    this.compactView = value;
    localStorage.setItem(COMPACT_VIEW_KEY, String(value));
  }

  /**
   * Navigates to the task details page.
   * @param id The ID of the task to view.
   */
  viewTask(id: number) {
    this.router.navigate(['/tasks', id]);
  }

  /**
   * Navigates to the create task page.
   */
  createTask() {
    this.shared.setTaskToEdit(null);
    this.router.navigate(['/create']);
  }

  /**
   * Emits an event to request editing a task.
   */
  @Output() editRequested = new EventEmitter<Task>();
  /**
   * Navigates to the edit task page.
   * @param task The task to edit.
   */
  editTask(task: Task) {
    this.shared.setTaskToEdit(task);
    this.router.navigate(['/edit/', task.id]);
  }

  /**
   * Deletes a task.
   * @param id The ID of the task to delete.
   */
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

  /**
   * Toggles the sort order.
   */
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  /**
   * Gets the filtered and sorted list of tasks.
   */
  get filteredTasks() {
    let filtered = this.tasks.filter(task => {
      const statusMatch = !this.statusFilter || task.status === this.statusFilter;
      
      const dueDateMatch = (() => {
        if (!this.dueDateFilter) { // If dueDateFilter is an empty string, null, or undefined
          return true; // No date filter applied
        }
        try {
          const taskDueDate = new Date(task.dueDate);
          // this.dueDateFilter is a Date object from MatDatepicker or a parsable date string
          const filterDateSelected = new Date(this.dueDateFilter);

          // Create a new Date object representing the END of the selected filter day
          const filterDateEnd = new Date(filterDateSelected);
          filterDateEnd.setHours(23, 59, 59, 999);

          return taskDueDate <= filterDateEnd;
        } catch (e) {
          // Log error if date parsing fails, though dates from backend and datepicker should be valid
          console.error('Error parsing dates for due date filter:', task.dueDate, this.dueDateFilter, e);
          return false; // Exclude task if dates are unparsable
        }
      })();

      return statusMatch && dueDateMatch;
    });

    // Sort the tasks by title or due date
    if (this.sortBy === 'title') {
      filtered = filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'dueDate') {
      filtered = filtered.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    }

    // Reverse the order if descending
    if (this.sortOrder === 'desc') {
      filtered = filtered.reverse();
    }

    return filtered;
  }

  /**
   * Checks if a task is overdue.
   * @param task The task to check.
   * @returns True if the task is overdue, false otherwise.
   */
  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date('2025-05-03'); // Use current date context
    return due < now && task.status !== 'Done';
  }

  /**
   * Checks if a task is due soon.
   * @param task The task to check.
   * @returns True if the task is due soon, false otherwise.
   */
  isDueSoon(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date('2025-05-03');
    const soon = new Date(now);
    soon.setDate(now.getDate() + 3); // Next 3 days
    return due >= now && due <= soon && task.status !== 'Done';
  }
}

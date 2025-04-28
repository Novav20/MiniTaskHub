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
    MatFormFieldModule
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

  constructor(private tasksService: TasksService, private shared: SharedService, private router: Router) { }
  ngOnInit(): void {
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

  get filteredTasks() {
    return this.tasks.filter(task => {
      const statusMatch = !this.statusFilter || task.status === this.statusFilter;
      const dueDateMatch = !this.dueDateFilter || task.dueDate <= this.dueDateFilter;
      return statusMatch && dueDateMatch;
    });
  }


}

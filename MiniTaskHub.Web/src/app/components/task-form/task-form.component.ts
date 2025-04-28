import { Component } from '@angular/core';
import { TaskStatus } from '../../models/task-status.enum';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule, 
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  task: Task = {
    title: '',
    description: '',
    status: TaskStatus.Pending,
    dueDate: ''
  }

  isEditMode = false;
  editingTaskId: number | null = null;
  taskStatusOptions = Object.values(TaskStatus);
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private tasksService: TasksService,
    private shared: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Check if there's a task in the shared service
    this.shared.taskToEdit$.subscribe(task => {
      if (task) {
        this.populateForm(task);
      }
    });

    // If no task in shared service, get id from route and fetch from backend
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !this.isEditMode) {
        this.tasksService.getTaskById(+id).subscribe(task => {
          if (task) {
            this.populateForm(task);
          }
        });
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isEditMode && this.editingTaskId !== null) {
        this.tasksService.updateTask(this.editingTaskId, this.task).subscribe({
          next: (task) => {
            this.loading = false;
            this.resetForm(form);
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.message;
          }
        });
      }
      else {
        this.tasksService.createTask(this.task).subscribe({
          next: () => {
            this.loading = false;
            this.resetForm(form);
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.message;
          }
        });
      }
    }
  }

  populateForm(task: Task) {
    this.task = { ...task };
    if (this.task.dueDate) {
      this.task.dueDate = this.task.dueDate.split('T')[0];
    }
    this.isEditMode = true;
    this.editingTaskId = task.id!;
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.task = {
      title: '',
      description: '',
      status: TaskStatus.Pending,
      dueDate: ''
    };
    this.isEditMode = false;
    this.editingTaskId = null;
  }
}

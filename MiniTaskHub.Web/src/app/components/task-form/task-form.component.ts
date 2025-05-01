import { Component } from '@angular/core';
import { TaskStatus } from '../../models/task-status.enum';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  form: FormGroup;
  isEditMode = false;
  editingTaskId: number | null = null;
  taskStatusOptions = Object.values(TaskStatus);
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private shared: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      status: [TaskStatus.Pending, Validators.required],
      dueDate: ['', Validators.required]
    });

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

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.isEditMode && this.editingTaskId !== null) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Confirm Edit',
            message: 'Do you want to save the changes to this task?'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.loading = true;
            this.tasksService.updateTask(this.editingTaskId!, formValue).subscribe({
              next: () => {
                this.loading = false;
                this.resetForm();
                this.router.navigate(['/']);
              },
              error: (error) => {
                this.loading = false;
                this.errorMessage = error.message;
              }
            });
          }
        });
      }
      else {
        this.tasksService.createTask(formValue).subscribe({
          next: () => {
            this.loading = false;
            this.resetForm();
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

  onCancel() {
    this.router.navigate(['/']);
  }

  populateForm(task: Task) {
    this.form.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    this.isEditMode = true;
    this.editingTaskId = task.id!;
  }

  resetForm() {
    this.form.reset({
      title: '',
      description: '',
      status: TaskStatus.Pending,
      dueDate: ''
    });
    this.isEditMode = false;
    this.editingTaskId = null;
  }
}

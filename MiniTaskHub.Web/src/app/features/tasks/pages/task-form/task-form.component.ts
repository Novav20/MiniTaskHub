import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskItemStatus, TaskItem, TaskDto } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private location = inject(Location);

  taskForm!: FormGroup;
  taskItemStatusOptions = Object.values(TaskItemStatus);
  isEditMode: boolean = false;
  taskId: number | null = null;

  // Icons
  faSave = faSave;
  faTimes = faTimes;

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      status: [TaskItemStatus.Pending, Validators.required],
      dueDate: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id; // Convert string to number
        this.taskService.getTaskById(this.taskId).subscribe({
          next: (task: TaskItem) => {
            this.taskForm.patchValue({
              title: task.title,
              description: task.description,
              status: task.status,
              dueDate: task.dueDate.split('T')[0] // Format date for input type="date"
            });
          },
          error: (err: any) => {
            console.error('Error loading task for edit:', err);
            // Optionally navigate away or show error message
            this.router.navigate(['/tasks']);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskDto: TaskDto = this.taskForm.value;

      if (this.isEditMode && this.taskId !== null) {
        // Update existing task
        this.taskService.updateTask(this.taskId, taskDto).subscribe({
          next: () => {
            console.log('Task updated successfully!');
            this.location.back(); // Go back after update
          },
          error: (err: any) => {
            console.error('Error updating task:', err);
          }
        });
      } else {
        // Create new task
        this.taskService.createTask(taskDto).subscribe({
          next: () => {
            console.log('Task created successfully!');
            this.location.back(); // Go back after creation
          },
          error: (err: any) => {
            console.error('Error creating task:', err);
          }
        });
      }
    } else {
      console.log('Form is invalid');
      this.taskForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back();
  }
}

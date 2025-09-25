import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem, TaskItemStatus, TaskDto } from '../../../../core/models/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  task?: TaskItem;
  taskForm!: FormGroup;
  isEditing = false;
  taskItemStatusOptions = Object.values(TaskItemStatus);

  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faSave = faSave;
  faTimes = faTimes;
  faArrowLeft = faArrowLeft;

  ngOnInit(): void {
    this.taskForm = this.fb.group({}); // Initialize with an empty group
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadTask(+id);
      } else {
        this.router.navigate(['/tasks']); // Redirect if no ID is provided
      }
    });
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task: TaskItem) => {
        this.task = task;
      },
      error: (err: any) => {
        console.error('Error loading task details:', err);
        this.router.navigate(['/tasks']); // Redirect to task list if not found or error
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

  startEdit(): void {
    if (!this.task) return;

    this.taskForm = this.fb.group({
      title: [this.task.title, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.task.description, [Validators.minLength(3), Validators.maxLength(500)]],
      status: [this.task.status, Validators.required],
      dueDate: [this.task.dueDate.split('T')[0], Validators.required]
    });
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (!this.task || !this.taskForm.valid) {
      return;
    }

    const updatedTaskDto: TaskDto = this.taskForm.value;

    this.taskService.updateTask(this.task.id, updatedTaskDto).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask; // Update the view with the returned task data
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating task:', err);
        // Optionally show an error message to the user
      }
    });
  }
}

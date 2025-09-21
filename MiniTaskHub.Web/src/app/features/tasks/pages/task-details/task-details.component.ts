import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItem } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  task: TaskItem | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.taskService.getTaskById(+id).subscribe({
          next: (task: TaskItem) => {
            this.task = task;
          },
          error: (err: any) => {
            console.error('Error loading task details:', err);
            this.router.navigate(['/tasks']); // Redirect to task list if not found or error
          }
        });
      } else {
        this.router.navigate(['/tasks']); // Redirect if no ID is provided
      }
    });
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks/edit', this.task.id]);
    }
  }

  deleteTask(): void {
    if (this.task) {
      // Implement confirmation dialog here
      if (confirm('Are you sure you want to delete this task?')) {
        this.taskService.deleteTask(this.task.id).subscribe({
          next: () => {
            console.log('Task deleted successfully!');
            this.router.navigate(['/tasks']);
          },
          error: (err: any) => {
            console.error('Error deleting task:', err);
          }
        });
      }
    }
  }
}

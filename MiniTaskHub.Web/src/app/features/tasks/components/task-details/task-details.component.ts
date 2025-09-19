import { Component, OnInit } from '@angular/core';

import { Task } from '../../../../shared/models/task.model';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DateHelperService } from '../../../../core/services/date-helper.service';

/**
 * Component for displaying the details of a single task.
 */
@Component({
  selector: 'app-task-details',
  imports: [MatCardModule, MatButton, RouterModule, CommonModule, MatIcon],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
  /**
   * The task to display.
   */
  task: Task | null = null;
  /**
   * Whether the component is in a loading state.
   */
  loading = true;
  /**
   * Error message to display to the user.
   */
  errorMessage: string | null = null;
  constructor(private route: ActivatedRoute, private tasksService: TasksService, public dateHelperService: DateHelperService) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tasksService.getTaskById(id).subscribe({
      next: (data: Task) => {
        this.task = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }
}

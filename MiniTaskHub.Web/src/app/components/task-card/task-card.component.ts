import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatCardActions, MatCardContent, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatusLabels } from '../../models/task-status.enum';

@Component({
  selector: 'app-task-card',
  imports:
    [
      CommonModule,
      MatCardActions,
      MatCardContent,
      MatCardTitle,
      MatCardModule,
      MatIconModule,
      MatButton
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  TaskStatusLabels = TaskStatusLabels;

  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Input() truncate = true;
  @Output() view = new EventEmitter<number>();
  @Input() cardClass: string | string[] = '';
  @Input() compactView = false;
  @Input() expandedView = false;

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

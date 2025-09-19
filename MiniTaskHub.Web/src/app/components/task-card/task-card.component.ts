import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatCardActions, MatCardContent, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatusLabels } from '../../models/task-status.enum';

/**
 * Component for displaying a single task card.
 */
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
  /**
   * The labels for the task statuses.
   */
  TaskStatusLabels = TaskStatusLabels;

  /**
   * The task to display.
   */
  @Input() task!: Task;
  /**
   * Event emitter for when the user requests to edit the task.
   */
  @Output() edit = new EventEmitter<Task>();
  /**
   * Event emitter for when the user requests to delete the task.
   */
  @Output() delete = new EventEmitter<number>();
  /**
   * Whether to truncate the task description.
   */
  @Input() truncate = true;
  /**
   * Event emitter for when the user requests to view the task.
   */
  @Output() view = new EventEmitter<number>();
  /**
   * The CSS class to apply to the card.
   */
  @Input() cardClass: string | string[] = '';
  /**
   * Whether to display the card in a compact view.
   */
  @Input() compactView = false;
  /**
   * Whether to display the card in an expanded view.
   */
  @Input() expandedView = false;

  // TODO: These methods are duplicated in task-list.component.ts. Refactor into a shared service.
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

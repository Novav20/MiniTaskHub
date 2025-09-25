import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem, TaskItemStatus } from '../../../core/models/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: TaskItem;

  @Output() editTask = new EventEmitter<number>();
  @Output() viewTaskDetails = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  // Icons
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  faCalendarDay = faCalendarDay;

  getBadgeClass(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.Pending:
        return 'badge-glass-pending';
      case TaskItemStatus.InProgress:
        return 'badge-glass-in-progress';
      case TaskItemStatus.Done:
        return 'badge-glass-done';
      default:
        return 'badge-glass-pending'; // A sensible default
    }
  }

  getBadgeText(status: TaskItemStatus): string {
    switch (status) {
      case TaskItemStatus.InProgress:
        return 'In Progress';
      default:
        return status; // For Pending, Done, etc., return as is
    }
  }

  onEditTask(): void {
    this.editTask.emit(this.task.id);
  }

  onViewTaskDetails(): void {
    this.viewTaskDetails.emit(this.task.id);
  }

  onDeleteTask(): void {
    this.deleteTask.emit(this.task.id);
  }
}

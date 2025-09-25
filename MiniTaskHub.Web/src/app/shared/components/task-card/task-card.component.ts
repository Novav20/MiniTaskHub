import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem, TaskItemStatus } from '../../../core/models/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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

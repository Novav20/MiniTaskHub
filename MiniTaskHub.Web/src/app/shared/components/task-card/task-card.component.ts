import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem, TaskItemStatus } from '../../../core/models/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEdit, faTrash, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, StatusBadgeComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

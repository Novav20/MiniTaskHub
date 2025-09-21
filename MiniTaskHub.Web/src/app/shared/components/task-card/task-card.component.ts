import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: TaskItem;

  @Output() editTask = new EventEmitter<number>();
  @Output() viewTaskDetails = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

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

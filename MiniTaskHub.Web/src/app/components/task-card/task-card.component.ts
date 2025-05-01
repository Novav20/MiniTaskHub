import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { MatCardActions, MatCardContent, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-task-card',
  imports:
    [
      CommonModule,
      MatCardActions,
      MatCardContent,
      MatCardTitle,
      MatCardModule,
      MatButton
    ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Input() truncate: boolean = true;
  @Output() view = new EventEmitter<number>();
  @Input() cardClass: string | string[] = '';
}

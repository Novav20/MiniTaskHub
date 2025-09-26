import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  @Input() status!: TaskItemStatus;

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
}

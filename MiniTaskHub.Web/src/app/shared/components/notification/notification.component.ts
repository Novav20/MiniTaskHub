import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Input() type: 'success' | 'danger' | 'info' | 'warning' = 'info';
  @Input() dismissible: boolean = true;
  @Input() autoClose: number = 5000; // milliseconds, 0 for no auto-close

  @Output() dismissed = new EventEmitter<void>();

  private timeoutId: any;

  ngOnInit(): void {
    if (this.autoClose > 0) {
      this.timeoutId = setTimeout(() => this.dismiss(), this.autoClose);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  get alertClass(): string {
    return `alert-${this.type}`;
  }
}

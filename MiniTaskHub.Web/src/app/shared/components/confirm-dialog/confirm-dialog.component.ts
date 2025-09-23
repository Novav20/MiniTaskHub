import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to perform this action?';
  @Input() confirmButtonText: string = 'Confirm';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() modalId: string = 'confirmModal';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private modal: any;

  ngAfterViewInit(): void {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
    }
  }

  show(): void {
    if (this.modal) {
      this.modal.show();
    }
  }

  hide(): void {
    if (this.modal) {
      this.modal.hide();
    }
  }

  onConfirm(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.confirm.emit();
    this.hide();
  }

  onCancel(): void {
    (document.activeElement as HTMLElement)?.blur();
    this.cancel.emit();
    this.hide();
  }

  ngOnDestroy(): void {
    this.hide();
    // Clean up the modal backdrop
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops[0]) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
    document.body.style.overflow = ''; // Restore body scroll
  }
}

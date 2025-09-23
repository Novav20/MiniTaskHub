import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface NotificationMessage {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'info' | 'warning';
  autoClose?: number; // milliseconds, 0 for no auto-close
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private notificationSubject = new Subject<NotificationMessage>();
  private nextId = 0;

  notification$ = this.notificationSubject.asObservable();

  constructor() { }

  handleError(error: any): void {
    let errorMessage = 'An unknown error occurred!';
    let errorType: NotificationMessage['type'] = 'danger';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Log to console based on error type
    if (error.status === 401 || error.status === 403) {
      console.warn('Global Error Handler (Handled):', errorMessage, error);
    } else {
      console.error('Global Error Handler (Unhandled):', errorMessage, error);
    }

    this.showNotification(errorMessage, errorType);
  }

  showSuccess(message: string, autoClose: number = 5000): void {
    this.showNotification(message, 'success', autoClose);
  }

  showInfo(message: string, autoClose: number = 5000): void {
    this.showNotification(message, 'info', autoClose);
  }

  showWarning(message: string, autoClose: number = 5000): void {
    this.showNotification(message, 'warning', autoClose);
  }

  private showNotification(message: string, type: NotificationMessage['type'], autoClose: number = 5000): void {
    const notification: NotificationMessage = {
      id: this.nextId++,
      message,
      type,
      autoClose,
      dismissible: true
    };
    this.notificationSubject.next(notification);
  }

  clearNotification(id: number): void {
    // In a more complex scenario, you might manage an array of notifications
    // and filter them here. For a single notification display, just completing
    // the subject or handling it in the component is enough.
    // For now, the component will handle dismissal.
  }
}

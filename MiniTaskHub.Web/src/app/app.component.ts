import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService, NotificationMessage } from './core/services/error.service';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private errorService = inject(ErrorService);
  private notificationSubscription!: Subscription;

  currentNotification: NotificationMessage | null = null;

  ngOnInit(): void {
    this.notificationSubscription = this.errorService.notification$.subscribe(notification => {
      this.currentNotification = notification;
    });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  onNotificationDismissed(): void {
    this.currentNotification = null;
  }
}

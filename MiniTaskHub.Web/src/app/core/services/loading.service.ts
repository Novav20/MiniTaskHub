import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for managing the loading state of the application.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  /**
   * Observable that emits the loading state.
   */
  loading$ = this.loadingSubject.asObservable();
  private requestCount = 0;

  /**
   * Shows the loading indicator.
   */
  show() {
    this.requestCount++;
    this.loadingSubject.next(true);
  }

  /**
   * Hides the loading indicator.
   */
  hide() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

}

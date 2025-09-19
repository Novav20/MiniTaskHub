import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for sharing data between components.
 */
@Injectable({ providedIn: 'root' })
export class SharedService {
  private taskToEditSubject = new BehaviorSubject<Task | null>(null);
  /**
   * Observable that emits the task to be edited.
   */
  taskToEdit$ = this.taskToEditSubject.asObservable();

  /**
   * Sets the task to be edited.
   * @param task The task to be edited.
   */
  setTaskToEdit(task: Task | null) {
    this.taskToEditSubject.next(task);
  }
}


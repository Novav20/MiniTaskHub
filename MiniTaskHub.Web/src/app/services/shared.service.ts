import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

// shared.service.ts
@Injectable({ providedIn: 'root' })
export class SharedService {
  private taskToEditSubject = new BehaviorSubject<Task | null>(null);
  taskToEdit$ = this.taskToEditSubject.asObservable();

  setTaskToEdit(task: Task | null) {
    this.taskToEditSubject.next(task);
  }
}


import { Injectable } from '@angular/core';
import { Task } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {

  constructor() { }

  /**
   * Checks if a task is overdue.
   * @param task The task to check.
   * @returns True if the task is overdue, false otherwise.
   */
  public isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    return due < now && task.status !== 'Done';
  }

  /**
   * Checks if a task is due soon.
   * @param task The task to check.
   * @returns True if the task is due soon, false otherwise.
   */
  public isDueSoon(task: Task): boolean {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    const soon = new Date(now);
    soon.setDate(now.getDate() + 3);
    return due >= now && due <= soon && task.status !== 'Done';
  }
}

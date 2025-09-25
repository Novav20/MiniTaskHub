import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskItem, TaskDto } from '../models/task.model';
import { environment } from '../../../environments/environment';
import { TasksRepository } from '../state/tasks.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);
  private tasksRepository = inject(TasksRepository);

  private apiUrl = `${environment.apiUrl}/tasks`;

  getAllTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl).pipe(
      tap(tasks => {
        this.tasksRepository.setTasks(tasks);
      })
    );
  }

  getTaskById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/${id}`).pipe(
      tap(task => {
        // Using updateEntities will add the task if it does not exist, or update it if it does.
        this.tasksRepository.updateTask(task.id, task);
      })
    );
  }

  createTask(task: TaskDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task).pipe(
      tap(newTask => {
        this.tasksRepository.addTask(newTask);
      })
    );
  }

  updateTask(id: number, task: TaskDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, task).pipe(
      tap(updatedTask => {
        this.tasksRepository.updateTask(id, updatedTask);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tasksRepository.deleteTask(id);
      })
    );
  }
}
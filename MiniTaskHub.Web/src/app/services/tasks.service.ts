import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Task } from '../models/task.model';

/**
 * Service for handling tasks.
 */
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) { }

  /**
   * Gets all tasks.
   * @returns An observable with the list of tasks.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  /**
   * Gets a task by its ID.
   * @param id The ID of the task.
   * @returns An observable with the task.
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Creates a new task.
   * @param task The task to create.
   * @returns An observable with the created task.
   */
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing task.
   * @param id The ID of the task to update.
   * @param task The updated task data.
   * @returns An observable with the updated task.
   */
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      // delay(1500),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a task.
   * @param id The ID of the task to delete.
   * @returns An observable that completes when the task is deleted.
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response.
   * @returns An observable that throws an error with a user-friendly message.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

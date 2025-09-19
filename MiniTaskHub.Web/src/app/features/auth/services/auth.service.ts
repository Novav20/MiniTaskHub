import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

/**
 * Service for handling user authentication.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Logs in a user.
   * @param credentials The user's email and password.
   * @returns An observable with the JWT token.
   */
  login(credentials: { email: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.token);
      })
    );
  }

  /**
   * Registers a new user.
   * @param data The user's email and password.
   * @returns An observable that completes when registration is successful.
   */
  register(data: { email: string, password: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  /**
   * Logs out the current user.
   */
  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  /**
   * Gets the JWT token from local storage.
   * @returns The JWT token, or null if it doesn't exist.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  /**
   * Checks if the user is authenticated.
   * @returns True if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

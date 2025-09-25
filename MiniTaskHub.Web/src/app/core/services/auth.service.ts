import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { LoginDto, RegisterDto, AuthResponse } from '../models/auth.model';
import { ApplicationUser } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { AuthRepository } from '../state/auth.repository';

interface DecodedToken {
  sub: string;
  email: string;
  // Other claims like iat, exp, etc., can be added if needed.
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authRepository = inject(AuthRepository);

  private apiUrl = `${environment.apiUrl}/auth`;

  isAuthenticated$ = this.authRepository.isAuthenticated$;
  user$ = this.authRepository.user$;

  constructor() {
    // On application startup, we could add logic here to verify the token
    // against the backend or fetch fresh user data if the token is present
    // but the user object is not in the store. For now, this is sufficient.
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginDto).pipe(
      tap((response) => {
        const decodedToken = jwtDecode<DecodedToken>(response.token);
        const user: ApplicationUser = {
          id: decodedToken.sub,
          email: decodedToken.email,
          userName: decodedToken.email, // Backend logic sets UserName to Email
        };
        this.authRepository.update({ user, token: response.token });
      })
    );
  }

  register(registerDto: RegisterDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, registerDto);
  }

  logout(): void {
    this.authRepository.logout();
    // The elf-persist-state plugin handles clearing the session storage.
  }

  getToken(): string | null {
    // Synchronous method for the HttpInterceptor.
    return this.authRepository.getTokenSnapshot();
  }
}
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinner, CommonModule, RouterModule, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading$: Observable<boolean>;
  title = 'MiniTaskHub';
  currentYear = new Date().getFullYear();

  constructor(
    private loadingService: LoadingService,
    public auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  isLoginPage() {
    return this.router.url === '/login';
  }
  isRegisterPage() {
    return this.router.url === '/register';
  }
  logout() {
    this.auth.logout();
    this.snackBar.open('You have been logged out', 'Close', { duration: 3000 });
  }

}

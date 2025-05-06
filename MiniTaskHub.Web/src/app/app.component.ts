import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinner, CommonModule, RouterModule, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading$: any;
  title = 'MiniTaskHub';
  currentYear = new Date().getFullYear();

  constructor(
    private loadingService: LoadingService,
    public auth: AuthService,
    private router: Router
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  isLoginPage() {
    return this.router.url === '/login';
  }
  isRegisterPage() {
    return this.router.url === '/register';
  }
}

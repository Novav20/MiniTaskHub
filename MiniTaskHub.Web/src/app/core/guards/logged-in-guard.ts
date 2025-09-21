import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // If the user is logged in, redirect them to the tasks page
    return router.createUrlTree(['/tasks']);
  }

  // If the user is not logged in, allow access to the route
  return true;
};
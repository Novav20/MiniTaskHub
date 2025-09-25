import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1), // Take the current value and complete
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      // Redirect to the login page
      return router.createUrlTree(['/auth/login']);
    })
  );
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * A route guard that checks if a user is authenticated before allowing access to a route.
 * If the user is not authenticated, they are redirected to the login page.
 * @param _route The route that is being activated.
 * @param _state The router state.
 * @returns True if the user is authenticated, false otherwise.
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

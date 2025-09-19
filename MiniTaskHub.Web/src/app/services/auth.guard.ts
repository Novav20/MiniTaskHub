import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

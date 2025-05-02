import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Embedding credentials in source code risks unauthorized access.
  // TODO: Replace with real token logic later
  const token = 'FAKE_TOKEN';
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq);
};

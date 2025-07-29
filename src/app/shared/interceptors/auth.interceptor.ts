import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service'; // Import ToastService

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService); // Inject ToastService

  if (authService.isLoggedIn()) {
    const cloneReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.gettoken())
    });
    return next(cloneReq).pipe(
      tap({
        error: (err: any) => {
          if (err.status === 401) {
            authService.deletetoken();
            setTimeout(() => {
           toastService.showError('Session Expired', 'Your session has expired. Please log in again.');            }, 7000);
            router.navigate(['/sign-in']);
          } else if (err.status === 403) {
           toastService.showWarning('Access Denied', 'You do not have permission to access this resource.');          }
        }
      })
    );
  } else {
    return next(req);
  }
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { elementAt,tap } from 'rxjs';
import { Router } from '@angular/router';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
   
  if(authService.isLoggedIn()) {
    const cloneReq = req.clone({
       headers: req.headers.set('Authorization', 'Bearer ' + authService.gettoken())
    })
    return next(cloneReq).pipe(
      tap(
        {
          error: (err: any) => {
            if(err.status == 401) {//dont have a valid token
              authService.deletetoken();
              setTimeout(() => {
                alert('Session expired. Please login again.');
              }, 1000);
            
              router.navigate(['/sign-in']);
            }
            else if(err.status == 403) {//user does not have access to the resource
              alert('Ooops! ,You do not have access to this resource.');
            }
          }
        }
      )
    );

  }
  else{
    return next(req);

  }
};

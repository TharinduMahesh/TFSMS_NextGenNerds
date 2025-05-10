// // Create a new file: src/app/shared/interceptors/ssl-interceptor.ts
// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable()
// export class SSLInterceptor implements HttpInterceptor {
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // For development only: Replace https with http for localhost requests
//     if (request.url.includes('localhost') && request.url.startsWith('https://')) {
//       const clonedRequest = request.clone({
//         url: request.url.replace('https://', 'http://')
//       });
//       return next.handle(clonedRequest).pipe(
//         catchError(error => {
//           console.error('Request error:', error);
//           return throwError(() => error);
//         })
//       );
//     }
    
//     return next.handle(request).pipe(
//       catchError(error => {
//         console.error('Request error:', error);
//         return throwError(() => error);
//       })
//     );
//   }
// }

// src/app/shared/interceptors/ssl-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SSLInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // For development only: Replace https with http for localhost requests
    if (request.url.includes('localhost') && request.url.startsWith('https://')) {
      const clonedRequest = request.clone({
        url: request.url.replace('https://', 'http://')
      });
      return next.handle(clonedRequest).pipe(
        catchError(error => {
          console.error('Request error:', error);
          return throwError(() => error);
        })
      );
    }

    return next.handle(request).pipe(
      catchError(error => {
        console.error('Request error:', error);
        return throwError(() => error);
      })
    );
  }
}




import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../shared/environments/environment';

export const sslBypassInterceptor: HttpInterceptorFn = (req, next) => {
  // Add a custom header to indicate that we want to bypass SSL validation
  // This will be handled by the backend or proxy
  if (environment.bypassSSLValidation && req.url.includes('localhost')) {
    req = req.clone({
      setHeaders: {
        'X-Bypass-SSL-Validation': 'true'
      }
    });
  }
  
  return next(req);
};


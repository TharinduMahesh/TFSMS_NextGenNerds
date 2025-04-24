import { CanActivateFn,Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  
  const router = inject(Router);

  
  if(authService.isLoggedIn()) {
    const claimReq = route.data['claimReq'];
    if(claimReq) {
      const claims = authService.getClaims();
      if(!claimReq(claims)) {
        router.navigate(['/forbidden']);
        return false;
      }
      return true;
    }
    return true;
  }
  else {
    router.navigate(['/sign-in']);
    return false;
  }
};

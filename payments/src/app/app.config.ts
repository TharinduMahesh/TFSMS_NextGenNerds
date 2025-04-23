import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient,withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay())]
};
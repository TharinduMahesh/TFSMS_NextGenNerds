    // src/app/Services/monthly-nsa.service.ts
    import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
    import { isPlatformBrowser } from '@angular/common';
    import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
    import { Observable, throwError } from 'rxjs';
    import { catchError } from 'rxjs/operators';
    import { MonthlyNsaSummary } from '../models/monthly-nsa-summary.interface';

    @Injectable({
      providedIn: 'root'
    })
    export class MonthlyNsaService {
      private apiUrl = 'http://localhost:5105/api/monthlynsa/summary';

      constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

      private getHeaders(): HttpHeaders {
        return new HttpHeaders({
          'Content-Type': 'application/json'
        });
      }

      getMonthlyNsaSummaries(startDate?: string, endDate?: string): Observable<MonthlyNsaSummary[]> {
        let params = new HttpParams();
        if (startDate) {
          params = params.append('startDate', startDate);
        }
        if (endDate) {
          params = params.append('endDate', endDate);
        }

        return this.http.get<MonthlyNsaSummary[]>(this.apiUrl, { params: params }).pipe(
          catchError(this.handleError.bind(this))
        );
      }

      private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('An API error occurred:', error);

        let errorMessage = 'An unknown error occurred. Please try again.';

        // FIX: Guard ProgressEvent and alert with isPlatformBrowser
        if (isPlatformBrowser(this.platformId)) {
          if (error.error instanceof ProgressEvent) { // Check for ProgressEvent only in browser
            errorMessage = `Could not connect to the backend API. Is the server running at ${this.apiUrl}?`;
          } else if (error.error && typeof error.error === 'object') {
            if ((error.error as any).Message) {
              errorMessage = `Server responded: ${(error.error as any).Message}`;
            } else if ((error.error as any).errors) {
              const validationErrors = Object.values((error.error as any).errors).flat();
              errorMessage = `Validation errors: ${validationErrors.join('; ')}`;
            }
          } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
          }
          alert(errorMessage); // Only call alert in browser
        } else {
          // Log error on server side without using browser APIs
          console.error(`Server-side error: ${error.status} - ${error.message}`);
          if (error.error && (error.error as any).Details) {
            console.error(`Backend Details: ${(error.error as any).Details}`);
          }
        }
        return throwError(() => new Error(errorMessage));
      }
    }
    
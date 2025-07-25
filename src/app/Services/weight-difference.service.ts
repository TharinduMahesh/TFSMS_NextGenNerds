// src/app/Services/weight-difference.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WeightDifference } from '../models/weight-difference.interface'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class WeightDifferenceService {
  private apiUrl = 'http://localhost:5105/api/weightdifferences'; // **IMPORTANT: Backend API endpoint**

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Fetches all weight difference records, with optional date filtering.
   * @param startDate Optional start date for filtering (YYYY-MM-DD).
   * @param endDate Optional end date for filtering (YYYY-MM-DD).
   * @returns An Observable of an array of WeightDifference objects.
   */
  getWeightDifferences(startDate?: string, endDate?: string): Observable<WeightDifference[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }

    return this.http.get<WeightDifference[]>(this.apiUrl, { params: params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // You can add methods for getting by collectionId or supplierId if needed for other reports/views
  // getWeightDifferencesByCollectionId(collectionId: number): Observable<WeightDifference[]> { ... }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error in WeightDifferenceService:', error);
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      if (error.status) {
        errorMessage = `Server returned code ${error.status}: ${error.statusText || 'Unknown Error'}`;
      }
      if (error.error && typeof error.error === 'object') {
        if ((error.error as any).Message) {
          errorMessage = `Server responded: ${(error.error as any).Message}`;
        } else if ((error.error as any).errors) {
          const validationErrors = Object.values((error.error as any).errors).flat();
          errorMessage = `Validation errors: ${validationErrors.join('; ')}`;
        } else if (error.error instanceof ProgressEvent) {
            errorMessage = `Could not connect to the backend API. Is the server running at ${this.apiUrl}?`;
        }
      } else if (error.message) {
        errorMessage = `HTTP error: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}

// src/app/Services/claim-adjustment.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClaimAdjustment } from '../models/claim-adjustment.interface';

@Injectable({
  providedIn: 'root'
})
export class ClaimAdjustmentService {
  private apiUrl = 'http://localhost:5105/api/claimadjustments'; // **IMPORTANT: Define your backend API endpoint**

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getClaimAdjustments(): Observable<ClaimAdjustment[]> {
    return this.http.get<ClaimAdjustment[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  addClaimAdjustment(adjustment: ClaimAdjustment): Observable<ClaimAdjustment> {
    return this.http.post<ClaimAdjustment>(this.apiUrl, adjustment, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // NEW: Update an existing claim adjustment
  updateClaimAdjustment(id: number, adjustment: ClaimAdjustment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, adjustment, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // NEW: Delete a claim adjustment
  deleteClaimAdjustment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error in ClaimAdjustmentService:', error);
    let errorMessage = 'Failed to process claim adjustment. Please try again.';
    if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'object' && (error.error as any).Message) {
      errorMessage = `Server responded: ${(error.error as any).Message}`;
    } else if (error.message) {
      errorMessage = `HTTP error: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

// src/app/Services/claim-entry.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClaimEntry } from '../models/claim-entry.interface'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class ClaimEntryService {
  private apiUrl = 'http://localhost:5105/api/claimentries'; // **IMPORTANT: Define your backend API endpoint**

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Fetch all existing claim entries
  getClaimEntries(): Observable<ClaimEntry[]> {
    return this.http.get<ClaimEntry[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this)) // Bind 'this' for handleError
    );
  }

  // Add a new claim entry
  addClaimEntry(claim: ClaimEntry): Observable<ClaimEntry> {
    return this.http.post<ClaimEntry>(this.apiUrl, claim, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // NEW: Update an existing claim entry
  updateClaimEntry(id: number, claim: ClaimEntry): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, claim, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // NEW: Delete a claim entry
  deleteClaimEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error in ClaimEntryService:', error);
    let errorMessage = 'Failed to process claim entry. Please try again.';
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

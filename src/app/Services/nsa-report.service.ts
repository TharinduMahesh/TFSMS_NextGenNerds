// src/app/services/nsa-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NsaEntry } from '../models/nsa-entry.interface'; // Import the updated NsaEntry interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class NsaReportService {
  // Base URL for your .NET NsaEntriesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  // Based on your launchSettings.json, 'http://localhost:5105' is a common HTTP port.
  private apiUrl = 'http://localhost:5105/api/NsaEntries'; // Matches the transformed backend controller

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers (might not be strictly needed for GET, but good practice)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in NsaReportService:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred while fetching NSA report.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'object' && error.error.Message) {
      errorMessage = `Server error: ${error.status} - ${error.statusText || ''}\nDetails: ${error.error.Message}`;
    } else if (error.error) {
      errorMessage = `Server error: ${error.status} - ${error.statusText || ''}\nDetails: ${JSON.stringify(error.error)}`;
    } else {
      errorMessage = `HTTP error: ${error.status} - ${error.statusText || ''}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  /**
   * @method getNsaReports
   * @description Fetches aggregated NSA report data from the backend.
   * @param startDate Optional: Start date for filtering the report.
   * @param endDate Optional: End date for filtering the report.
   * @returns An Observable of an array of NsaEntry objects.
   */
  getNsaReports(startDate?: string, endDate?: string): Observable<NsaEntry[]> {
    let params = new HttpHeaders(); // Use HttpHeaders for params, not HttpParams for simplicity if only 2 params

    // Use HttpParams if you have many parameters or complex encoding needs
    // let httpParams = new HttpParams();
    // if (startDate) { httpParams = httpParams.set('startDate', startDate); }
    // if (endDate) { httpParams = httpParams.set('endDate', endDate); }

    // For simplicity with HttpHeaders, just append query string manually if only a few params
    let url = this.apiUrl;
    const queryParams = [];
    if (startDate) { queryParams.push(`startDate=${startDate}`); }
    if (endDate) { queryParams.push(`endDate=${endDate}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<NsaEntry[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // The following CRUD methods are commented out/removed as NSA entries are now aggregated reports,
  // not individual entries to be added/updated/deleted manually via frontend forms.
  // If you later implement a backend process to save these reports, you might add a POST for that.

  // addNsaEntry(entry: NsaEntry): Observable<NsaEntry> {
  //   return this.http.post<NsaEntry>(this.apiUrl, entry, { headers: this.getHeaders() })
  //     .pipe(catchError(this.handleError));
  // }

  // updateNsaEntry(id: number, entry: NsaEntry): Observable<void> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put<void>(url, entry, { headers: this.getHeaders() })
  //     .pipe(catchError(this.handleError));
  // }

  // deleteNsaEntry(id: number): Observable<void> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.delete<void>(url)
  //     .pipe(catchError(this.handleError));
  // }
}

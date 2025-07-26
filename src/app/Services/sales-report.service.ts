// src/app/Services/sales-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SalesEntry } from '../models/sales-entry.interface'; // Import the SalesEntry interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class SalesReportService {
  // Base URL for your .NET SalesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  // Based on your launchSettings.json, 'http://localhost:5105' is a common HTTP port.
  private apiUrl = 'http://localhost:5105/api/Sales'; // Matches the SalesController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in SalesReportService:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred while fetching sales report.';
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
   * @method getSalesEntries
   * @description Fetches sales entries data from the backend.
   * @param startDate Optional: Start date for filtering.
   * @param endDate Optional: End date for filtering.
   * @returns An Observable of an array of SalesEntry objects.
   */
  getSalesEntries(startDate?: string, endDate?: string): Observable<SalesEntry[]> {
    let url = this.apiUrl;
    const queryParams = [];
    if (startDate) { queryParams.push(`startDate=${startDate}`); }
    if (endDate) { queryParams.push(`endDate=${endDate}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<SalesEntry[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // For a report service, typically no POST/PUT/DELETE methods are needed.
  // These would be in a separate 'SalesEntryService' if you build a sales entry form.
}

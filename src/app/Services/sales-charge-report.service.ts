// src/app/services/sales-charge-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SalesCharge } from '../models/sales-charge.interface'; // Import the SalesCharge interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class SalesChargeReportService {
  // Base URL for your .NET SalesChargesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  // Based on your launchSettings.json, 'http://localhost:5105' is a common HTTP port.
  private apiUrl = 'http://localhost:5105/api/SalesCharges'; // Matches the SalesChargesController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in SalesChargeReportService:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred while fetching sales charge report.';
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
   * @method getSalesCharges
   * @description Fetches sales charge entries data from the backend.
   * @param startDate Optional: Start date for filtering.
   * @param endDate Optional: End date for filtering.
   * @returns An Observable of an array of SalesCharge objects.
   */
  getSalesCharges(startDate?: string, endDate?: string): Observable<SalesCharge[]> {
    let url = this.apiUrl;
    const queryParams = [];
    if (startDate) { queryParams.push(`startDate=${startDate}`); }
    if (endDate) { queryParams.push(`endDate=${endDate}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<SalesCharge[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // For a report service, typically no POST/PUT/DELETE methods are needed.
  // These would be in a separate 'SalesChargeEntryService' if you build an entry form.
}

// src/app/services/gratis-issue-report.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GratisIssue } from '../models/gratis-issue.interface'; // Import the GratisIssue interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class GratisIssueReportService { // NEW: Dedicated service for reports
  // Base URL for your .NET GratisIssuesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  // Based on your launchSettings.json, 'http://localhost:5105' is a common HTTP port.
  private apiUrl = 'http://localhost:5105/api/GratisIssues'; // Matches the GratisIssuesController

  constructor(private http: HttpClient) { }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in GratisIssueReportService:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred while fetching gratis issue report.';
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
   * @method getGratisIssues
   * @description Fetches gratis issue entries data from the backend for reporting.
   * @param startDate Optional: Start date for filtering.
   * @param endDate Optional: End date for filtering.
   * @returns An Observable of an array of GratisIssue objects.
   */
  getGratisIssues(startDate?: string, endDate?: string): Observable<GratisIssue[]> {
    let url = this.apiUrl;
    const queryParams = [];
    if (startDate) { queryParams.push(`startDate=${startDate}`); }
    if (endDate) { queryParams.push(`endDate=${endDate}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<GratisIssue[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  // This service is specifically for reports, so no CRUD methods are included.
  // CRUD operations are handled by GratisIssueService (for the entry page).
}

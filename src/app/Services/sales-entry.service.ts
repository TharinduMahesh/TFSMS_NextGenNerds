// src/app/Services/sales-entry.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SalesEntry } from '../models/sales-entry.interface'; // Import the SalesEntry interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class SalesEntryService { // NEW: Dedicated service for Sales Entry CRUD
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
    console.error('API Error occurred in SalesEntryService:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred.';
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
   * @description Fetches all sales records from the backend.
   * This is for the entry page's table display.
   * @returns An Observable of an array of SalesEntry objects.
   */
  getSalesEntries(): Observable<SalesEntry[]> {
    return this.http.get<SalesEntry[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method addSalesEntry
   * @description Sends a new sales record to the backend for creation.
   * @param entry The SalesEntry object to add.
   * @returns An Observable of the newly created SalesEntry object (with ID).
   */
  addSalesEntry(entry: SalesEntry): Observable<SalesEntry> {
    return this.http.post<SalesEntry>(this.apiUrl, entry, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateSalesEntry
   * @description Sends an updated sales record to the backend.
   * @param id The ID of the sales entry to update.
   * @param entry The SalesEntry object with updated data.
   * @returns An Observable of void.
   */
  updateSalesEntry(id: number, entry: SalesEntry): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, entry, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteSalesEntry
   * @description Sends a request to delete a sales record by ID.
   * @param id The ID of the sales entry to delete.
   * @returns An Observable of void.
   */
  deleteSalesEntry(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

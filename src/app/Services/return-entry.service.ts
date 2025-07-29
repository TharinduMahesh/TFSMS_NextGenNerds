// src/app/services/return-entry.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ReturnEntry } from '../models/return-analysis.interface'; // Import the ReturnEntry interface (assuming its path)

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class ReturnEntryService { // NEW: Dedicated service for Return Entry CRUD
  // Base URL for your .NET ReturnEntriesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  private apiUrl = 'http://localhost:5105/api/ReturnEntries'; // Matches the ReturnEntriesController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in ReturnEntryService:', error); // Log the full error for debugging

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
   * @method getReturnEntries
   * @description Fetches all return entries from the backend.
   * This is for the entry page's table display.
   * @returns An Observable of an array of ReturnEntry objects.
   */
  getReturnEntries(): Observable<ReturnEntry[]> {
    return this.http.get<ReturnEntry[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method addReturnEntry
   * @description Sends a new return entry record to the backend for creation.
   * @param entry The ReturnEntry object to add.
   * @returns An Observable of the newly created ReturnEntry object (with ID).
   */
  addReturnEntry(entry: ReturnEntry): Observable<ReturnEntry> {
    return this.http.post<ReturnEntry>(this.apiUrl, entry, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateReturnEntry
   * @description Sends an updated return entry record to the backend.
   * @param id The ID of the return entry to update.
   * @param entry The ReturnEntry object with updated data.
   * @returns An Observable of void.
   */
  updateReturnEntry(id: number, entry: ReturnEntry): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, entry, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteReturnEntry
   * @description Sends a request to delete a return entry record by ID.
   * @param id The ID of the return entry to delete.
   * @returns An Observable of void.
   */
  deleteReturnEntry(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

// src/app/Services/gratis-issue.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GratisIssue } from '../models/gratis-issue.interface'; // Import the interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class GratisIssueService {
  // Base URL for your .NET GratisIssuesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  // Based on your launchSettings.json, 'http://localhost:5105' is a common HTTP port.
  private apiUrl = 'http://localhost:5105/api/GratisIssues';

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend error (e.g., 404, 500)
      errorMessage = `Server error: ${error.status} - ${error.statusText || ''}`;
      if (error.error && typeof error.error === 'object' && error.error.Message) {
        errorMessage += `\nDetails: ${error.error.Message}`;
      } else if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  /**
   * @method getGratisIssues
   * @description Fetches all gratis issue records from the backend.
   * @returns An Observable of an array of GratisIssue objects.
   */
  getGratisIssues(): Observable<GratisIssue[]> {
    return this.http.get<GratisIssue[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method getGratisIssueById
   * @description Fetches a single gratis issue record by its ID.
   * @param id The ID of the gratis issue.
   * @returns An Observable of a single GratisIssue object.
   */
  getGratisIssueById(id: number): Observable<GratisIssue> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<GratisIssue>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method addGratisIssue
   * @description Sends a new gratis issue record to the backend for creation.
   * @param issue The GratisIssue object to add.
   * @returns An Observable of the newly created GratisIssue object (with ID).
   */
  addGratisIssue(issue: GratisIssue): Observable<GratisIssue> {
    return this.http.post<GratisIssue>(this.apiUrl, issue, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateGratisIssue
   * @description Sends an updated gratis issue record to the backend.
   * @param issue The GratisIssue object with updated data.
   * @returns An Observable of void (or the updated object, depending on API).
   */
  updateGratisIssue(issue: GratisIssue): Observable<void> {
    const url = `${this.apiUrl}/${issue.id}`;
    return this.http.put<void>(url, issue, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteGratisIssue
   * @description Sends a request to delete a gratis issue record by ID.
   * @param id The ID of the gratis issue to delete.
   * @returns An Observable of void.
   */
  deleteGratisIssue(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

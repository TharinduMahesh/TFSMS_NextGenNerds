// src/app/services/packed-tea.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PackedTea } from '../models/packed-tea.interface'; // Import the PackedTea interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class PackedTeaService { // NEW: Dedicated service for PackedTea CRUD
  // Base URL for your .NET PackedTeaEntryController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  private apiUrl = 'http://localhost:5105/api/PackedTea'; // Matches the PackedTeaEntryController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in PackedTeaService:', error); // Log the full error for debugging

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
   * @method getPackedTeas
   * @description Fetches all packed tea records from the backend.
   * @returns An Observable of an array of PackedTea objects.
   */
  getPackedTeas(): Observable<PackedTea[]> {
    return this.http.get<PackedTea[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method addPackedTea
   * @description Sends a new packed tea record to the backend for creation.
   * @param packedTea The PackedTea object to add.
   * @returns An Observable of the newly created PackedTea object (with ID).
   */
  addPackedTea(packedTea: PackedTea): Observable<PackedTea> {
    return this.http.post<PackedTea>(this.apiUrl, packedTea, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updatePackedTea
   * @description Sends an updated packed tea record to the backend.
   * @param id The ID of the packed tea to update.
   * @param packedTea The PackedTea object with updated data.
   * @returns An Observable of void.
   */
  updatePackedTea(id: number, packedTea: PackedTea): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, packedTea, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deletePackedTea
   * @description Sends a request to delete a packed tea record by ID.
   * @param id The ID of the packed tea to delete.
   * @returns An Observable of void.
   */
  deletePackedTea(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

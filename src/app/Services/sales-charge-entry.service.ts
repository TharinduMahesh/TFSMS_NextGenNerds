// src/app/Services/sales-charge-entry.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SalesCharge } from '../models/sales-charge.interface'; // Import the SalesCharge interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class SalesChargeEntryService { // NEW: Renamed to SalesChargeEntryService
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
    console.error('API Error occurred in SalesChargeEntryService:', error); // Log the full error for debugging

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
   * @method getSalesCharges
   * @description Fetches all sales charge records from the backend.
   * This is for the entry page's table display.
   * @returns An Observable of an array of SalesCharge objects.
   */
  getSalesCharges(): Observable<SalesCharge[]> {
    return this.http.get<SalesCharge[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method addSalesCharge
   * @description Sends a new sales charge record to the backend for creation.
   * @param charge The SalesCharge object to add.
   * @returns An Observable of the newly created SalesCharge object (with ID).
   */
  addSalesCharge(charge: SalesCharge): Observable<SalesCharge> {
    return this.http.post<SalesCharge>(this.apiUrl, charge, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateSalesCharge
   * @description Sends an updated sales charge record to the backend.
   * @param id The ID of the sales charge to update.
   * @param charge The SalesCharge object with updated data.
   * @returns An Observable of void.
   */
  updateSalesCharge(id: number, charge: SalesCharge): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, charge, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteSalesCharge
   * @description Sends a request to delete a sales charge record by ID.
   * @param id The ID of the sales charge to delete.
   * @returns An Observable of void.
   */
  deleteSalesCharge(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

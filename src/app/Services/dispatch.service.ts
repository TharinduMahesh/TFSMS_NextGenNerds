// src/app/services/dispatch.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dispatch } from '../models/dispatch.interface'; // Import the Dispatch interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class DispatchService { // NEW: Dedicated service for Dispatch CRUD
  // Base URL for your .NET DispatchController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  private apiUrl = 'http://localhost:5105/api/Dispatch'; // Matches the DispatchController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in DispatchService:', error); // Log the full error for debugging

    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'object' && error.error.Message) {
      errorMessage = `Server error: ${error.status} - ${error.statusText || ''}\nDetails: ${error.error.Message}`;
    } else {
      errorMessage = `HTTP error: ${error.status} - ${error.statusText || ''}\nDetails: ${JSON.stringify(error.error)}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  /**
   * @method getDispatches
   * @description Fetches all dispatch records from the backend.
   * @param startDate Optional: Filter by dispatch date.
   * @param endDate Optional: Filter by dispatch date.
   * @param invoiceNumber Optional: Filter by associated invoice number.
   * @param vehicleNumber Optional: Filter by vehicle number.
   * @returns An Observable of an array of Dispatch objects.
   */
  getDispatches(startDate?: string, endDate?: string, invoiceNumber?: string, vehicleNumber?: string): Observable<Dispatch[]> {
    let url = this.apiUrl;
    const queryParams = [];
    if (startDate) { queryParams.push(`startDate=${startDate}`); }
    if (endDate) { queryParams.push(`endDate=${endDate}`); }
    if (invoiceNumber) { queryParams.push(`invoiceNumber=${invoiceNumber}`); }
    if (vehicleNumber) { queryParams.push(`vehicleNumber=${vehicleNumber}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<Dispatch[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method getDispatchById
   * @description Fetches a single dispatch record by its ID.
   * @param id The ID of the dispatch.
   * @returns An Observable of a Dispatch object.
   */
  getDispatchById(id: number): Observable<Dispatch> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Dispatch>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method createDispatch
   * @description Sends a new dispatch record to the backend for creation.
   * @param dispatch The Dispatch object to create.
   * @returns An Observable of the newly created Dispatch object (with ID).
   */
  createDispatch(dispatch: Dispatch): Observable<Dispatch> {
    return this.http.post<Dispatch>(this.apiUrl, dispatch, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateDispatch
   * @description Sends an updated dispatch record to the backend.
   * @param id The ID of the dispatch to update.
   * @param dispatch The Dispatch object with updated data.
   * @returns An Observable of void.
   */
  updateDispatch(id: number, dispatch: Dispatch): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, dispatch, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteDispatch
   * @description Sends a request to delete a dispatch record by ID.
   * @param id The ID of the dispatch to delete.
   * @returns An Observable of void.
   */
  deleteDispatch(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

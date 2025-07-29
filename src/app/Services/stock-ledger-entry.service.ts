// src/app/services/stock-ledger-entry.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StockLedgerEntry } from '../models/stock-ledger-entry.interface'; // Import the StockLedgerEntry interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class StockLedgerEntryService { // NEW: Dedicated service for StockLedgerEntry CRUD
  // Base URL for your .NET StockLedgerEntriesController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  private apiUrl = 'http://localhost:5105/api/StockLedgerEntries'; // Matches the StockLedgerEntriesController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in StockLedgerEntryService:', error); // Log the full error for debugging

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
   * @method getStockLedgerEntries
   * @description Fetches all stock ledger entries from the backend.
   * @param status Optional: Filter by status (e.g., "Unsold", "Invoiced", "Sold").
   * @param grade Optional: Filter by tea grade.
   * @param gardenMark Optional: Filter by garden mark.
   * @returns An Observable of an array of StockLedgerEntry objects.
   */
  getStockLedgerEntries(status?: string, grade?: string, gardenMark?: string): Observable<StockLedgerEntry[]> {
    let url = this.apiUrl;
    const queryParams = [];
    if (status) { queryParams.push(`status=${status}`); }
    if (grade) { queryParams.push(`grade=${grade}`); }
    if (gardenMark) { queryParams.push(`gardenMark=${gardenMark}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<StockLedgerEntry[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method getStockLedgerEntryById
   * @description Fetches a single stock ledger entry by its ID.
   * @param id The ID of the stock ledger entry.
   * @returns An Observable of a StockLedgerEntry object.
   */
  getStockLedgerEntryById(id: number): Observable<StockLedgerEntry> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<StockLedgerEntry>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method addStockLedgerEntry
   * @description Sends a new stock ledger entry record to the backend for creation.
   * @param entry The StockLedgerEntry object to add.
   * @returns An Observable of the newly created StockLedgerEntry object (with ID).
   */
  addStockLedgerEntry(entry: StockLedgerEntry): Observable<StockLedgerEntry> {
    return this.http.post<StockLedgerEntry>(this.apiUrl, entry, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateStockLedgerEntry
   * @description Sends an updated stock ledger entry record to the backend.
   * @param id The ID of the stock ledger entry to update.
   * @param entry The StockLedgerEntry object with updated data.
   * @returns An Observable of void.
   */
  updateStockLedgerEntry(id: number, entry: StockLedgerEntry): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, entry, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteStockLedgerEntry
   * @description Sends a request to delete a stock ledger entry record by ID.
   * @param id The ID of the stock ledger entry to delete.
   * @returns An Observable of void.
   */
  deleteStockLedgerEntry(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

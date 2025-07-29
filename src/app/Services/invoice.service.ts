// src/app/services/invoice.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Invoice } from '../models/invoice.interface'; // Import the Invoice interface

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class InvoiceService { // NEW: Dedicated service for Invoice CRUD
  // Base URL for your .NET InvoiceController API
  // IMPORTANT: Adjust this URL to match your .NET backend's actual running port.
  private apiUrl = 'http://localhost:5105/api/Invoice'; // Matches the InvoiceController

  constructor(private http: HttpClient) { }

  // Helper for consistent HTTP headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Generic error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error occurred in InvoiceService:', error); // Log the full error for debugging

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
   * @method getInvoices
   * @description Fetches all invoice records from the backend.
   * @param status Optional: Filter by status (e.g., "Pending", "Dispatched", "Paid").
   * @param invoiceNumber Optional: Filter by invoice number.
   * @param startDate Optional: Start date for filtering.
   * @param endDate Optional: End date for filtering.
   * @returns An Observable of an array of Invoice objects.
   */
  getInvoices(status?: string, invoiceNumber?: string, startDate?: string, endDate?: string): Observable<Invoice[]> {
    let url = this.apiUrl;
    const queryParams = [];
    if (status) { queryParams.push(`status=${status}`); }
    if (invoiceNumber) { queryParams.push(`invoiceNumber=${invoiceNumber}`); }
    if (startDate) { queryParams.push(`startDate=${startDate}`); }
    if (endDate) { queryParams.push(`endDate=${endDate}`); }
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return this.http.get<Invoice[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method getInvoiceById
   * @description Fetches a single invoice by its ID.
   * @param id The ID of the invoice.
   * @returns An Observable of an Invoice object.
   */
  getInvoiceById(id: number): Observable<Invoice> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Invoice>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method createInvoice
   * @description Sends a new invoice record to the backend for creation.
   * @param invoice The Invoice object to create.
   * @returns An Observable of the newly created Invoice object (with ID).
   */
  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method updateInvoice
   * @description Sends an updated invoice record to the backend.
   * @param id The ID of the invoice to update.
   * @param invoice The Invoice object with updated data.
   * @returns An Observable of void.
   */
  updateInvoice(id: number, invoice: Invoice): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<void>(url, invoice, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * @method deleteInvoice
   * @description Sends a request to delete an invoice record by ID.
   * @param id The ID of the invoice to delete.
   * @returns An Observable of void.
   */
  deleteInvoice(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
}

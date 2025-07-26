import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateInvoicePayload, FinalizeSalePayload, InvoiceResponse } from '../../models/Ledger Management/invoiceSales.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceSalesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7263/api/invoices'; // Example port

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  // Method for the 'invoice-review' page
  getAllInvoices(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(this.apiUrl, {
      ...this.httpOptions,
      responseType: 'json' // Explicitly set response type
    })
      .pipe(catchError(this.handleError));
  }
  
  getInvoiceById(id: number): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Method for the 'invoice-create' page
  createInvoice(payload: CreateInvoicePayload): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(this.apiUrl, payload, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  // Method for the 'sales-entry' page
  finalizeSale(payload: FinalizeSalePayload): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${this.apiUrl}/finalize-sale`, payload, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      console.log('Full error object:', error);
      console.log('Error status:', error.status);
      console.log('Error response:', error.error);
      
      // Check if the response is HTML (common when API returns error pages)
      if (typeof error.error === 'string' && error.error.includes('<html>')) {
        errorMessage = `Server returned HTML instead of JSON. Status: ${error.status}. Check if the API endpoint is correct.`;
      } 
      // Check if it's a JSON parsing error
      else if (error.message.includes('Unexpected token')) {
        errorMessage = `Server returned non-JSON response. Status: ${error.status}. Response: ${error.error}`;
      }
      // Handle structured error responses
      else if (error.error?.message) {
        errorMessage = error.error.message;
      }
      // Handle simple error messages
      else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
      // Fallback for HTTP status errors
      else {
        errorMessage = `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
      }
    }
    
    console.error('InvoiceSalesService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
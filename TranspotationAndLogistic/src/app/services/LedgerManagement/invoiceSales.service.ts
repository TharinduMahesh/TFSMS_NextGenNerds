import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateInvoicePayload, FinalizeSalePayload, InvoiceResponse } from '../../models/Ledger Management/invoiceSales.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceSalesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7132/api/invoices'; // Example port

  // Method for the 'invoice-review' page
  getAllInvoices(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  
  getInvoiceById(id: number): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Method for the 'invoice-create' page
  createInvoice(payload: CreateInvoicePayload): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }
  
  // Method for the 'sales-entry' page
  finalizeSale(payload: FinalizeSalePayload): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${this.apiUrl}/finalize-sale`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'An unknown server error occurred.';
    console.error('InvoiceSalesService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
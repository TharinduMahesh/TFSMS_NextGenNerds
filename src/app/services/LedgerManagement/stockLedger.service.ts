import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CreatePackedTeaPayload, StockLedgerResponse } from '../../models/Ledger Management/stockLedger.model';

@Injectable({
  providedIn: 'root'
})
export class StockLedgerService {
  private http = inject(HttpClient);
  // Ensure the base URL matches the one your Ledger project is running on
  private apiUrl = 'https://localhost:7263/api/stockledger'; // Example port

  // Method for the 'tea-packing-entry' page
  createPackedTeaEntry(payload: CreatePackedTeaPayload): Observable<StockLedgerResponse> {
    return this.http.post<StockLedgerResponse>(`${this.apiUrl}/packing-entry`, payload)
      .pipe(catchError(this.handleError));
  }

  // Method for the 'stock-ledger-view' page
  getAllStockLedgerEntries(): Observable<StockLedgerResponse[]> {
    return this.http.get<StockLedgerResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  
  // Method to get a single entry (useful for dropdowns, etc.)
  getStockLedgerEntryById(id: number): Observable<StockLedgerResponse> {
    return this.http.get<StockLedgerResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'An unknown server error occurred.';
    console.error('StockLedgerService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
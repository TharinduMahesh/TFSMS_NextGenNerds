import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SalesRegisterReport, DispatchRegisterReport } from '../../models/Ledger Management/ledgerReports.model';
import { StockLedgerResponse } from '../../models/Ledger Management/stockLedger.model';

@Injectable({
  providedIn: 'root'
})
export class LedgerReportService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7132/api/ledgerreports'; // Example port

  // Method for the 'sales-register-report' page
  getSalesRegister(startDate: string, endDate: string): Observable<SalesRegisterReport[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<SalesRegisterReport[]>(`${this.apiUrl}/sales-register`, { params })
      .pipe(catchError(this.handleError));
  }

  // Method for the 'dispatch-register-report' page
  getDispatchRegister(startDate: string, endDate: string): Observable<DispatchRegisterReport[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<DispatchRegisterReport[]>(`${this.apiUrl}/dispatch-register`, { params })
      .pipe(catchError(this.handleError));
  }
  
  // Method for the 'unsold-tea-report' page
  getUnsoldTeaReport(): Observable<StockLedgerResponse[]> {
    return this.http.get<StockLedgerResponse[]>(`${this.apiUrl}/unsold-tea`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'An unknown server error occurred.';
    console.error('LedgerReportService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
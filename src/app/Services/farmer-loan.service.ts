// Services/farmer-loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FarmerLoan } from '../models/farmer-loan.interface';

@Injectable({
  providedIn: 'root'
})
export class FarmerLoanService {
  private apiUrl = 'http://localhost:5105/api/farmerloans';

  constructor(private http: HttpClient) {}

  getFarmerLoans(): Observable<FarmerLoan[]> {
    return this.http.get<FarmerLoan[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load farmer loans. Please try again.'));
      })
    );
  }

  getFarmerLoan(id: number): Observable<FarmerLoan> {
    return this.http.get<FarmerLoan>(`${this.apiUrl}/${id}`);
  }

  createFarmerLoan(farmerLoan: FarmerLoan): Observable<FarmerLoan> {
    return this.http.post<FarmerLoan>(this.apiUrl, farmerLoan);
  }

  updateFarmerLoan(farmerLoan: FarmerLoan): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${farmerLoan.id}`, farmerLoan);
  }

  deleteFarmerLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

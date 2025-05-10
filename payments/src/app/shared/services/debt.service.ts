import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Debt } from '../../models/debt.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private apiUrl = `${environment.apiBaseUrl}/debts`;

  constructor(private http: HttpClient) { }

  getAllDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error('Error fetching all debts:', error);
        return of([]);
      })
    );
  }

  // Removed duplicate getDebts() method

  getDebt(id: number): Observable<Debt | null> {
    return this.http.get<Debt>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching debt with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getDebtsBySupplier(supplierId: number): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.apiUrl}/supplier/${supplierId}`).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error(`Error fetching debts for supplier ${supplierId}:`, error);
        return of([]);
      })
    );
  }

  createDebt(debt: Debt): Observable<Debt | null> {
    return this.http.post<Debt>(this.apiUrl, debt).pipe(
      catchError(error => {
        console.error('Error creating debt:', error);
        return of(null);
      })
    );
  }

  updateDebt(debt: Debt): Observable<Debt | null> {
    return this.http.put<Debt>(`${this.apiUrl}/${debt.debtId}`, debt).pipe(
      catchError(error => {
        console.error(`Error updating debt with id ${debt.debtId}:`, error);
        return of(null);
      })
    );
  }

  deleteDebt(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting debt with id ${id}:`, error);
        return of(false);
      })
    );
  }

  deductFromDebt(id: number, amount: number): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {}).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deducting ${amount} from debt with id ${id}:`, error);
        return of(false);
      })
    );
  }

  getTotalDebtsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total debts count:', error);
        return of(0);
      })
    );
  }

  getTotalOutstandingAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total outstanding amount:', error);
        return of(0);
      })
    );
  }

  getTotalDeductionsMade(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalDeductions`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total deductions made:', error);
        return of(0);
      })
    );
  }

  // Removed duplicate getTotalOutstandingDebts() method as it's the same as getTotalOutstandingAmount()
}
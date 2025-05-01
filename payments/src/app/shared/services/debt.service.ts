

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Debt } from '../../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private apiUrl = "http://localhost:5274/api/debts";

  constructor(private http: HttpClient) { }

  getDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(this.apiUrl);
  }

  getDebt(id: number): Observable<Debt> {
    return this.http.get<Debt>(`${this.apiUrl}/${id}`);
  }

  getDebtsBySupplier(supplierId: number): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  deductFromDebt(id: number, amount: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {});
  }

  getTotalOutstandingDebts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`);
  }
}
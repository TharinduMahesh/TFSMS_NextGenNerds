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

  getAllDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(this.apiUrl);
  }

  getDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(this.apiUrl);
  }

  getDebt(id: number): Observable<Debt> {
    return this.http.get<Debt>(`${this.apiUrl}/${id}`);
  }

  getDebtsBySupplier(supplierId: number): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  createDebt(debt: Debt): Observable<Debt> {
    return this.http.post<Debt>(this.apiUrl, debt);
  }

  updateDebt(debt: Debt): Observable<Debt> {
    return this.http.put<Debt>(`${this.apiUrl}/${debt.debtId}`, debt);
  }

  deleteDebt(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deductFromDebt(id: number, amount: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {});
  }

  getTotalDebtsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getTotalOutstandingAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`);
  }

  getTotalDeductionsMade(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalDeductions`);
  }

  getTotalOutstandingDebts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`);
  }
}
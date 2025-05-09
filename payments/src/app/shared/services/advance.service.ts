import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advance } from '../../models/advance.model';

@Injectable({
  providedIn: 'root'
})
export class AdvanceService {
  private apiUrl = "https://localhost:7203/api/advances";

  constructor(private http: HttpClient) { }

  getAllAdvances(): Observable<Advance[]> {
    return this.http.get<Advance[]>(this.apiUrl);
  }

  getAdvances(): Observable<Advance[]> {
    return this.http.get<Advance[]>(this.apiUrl);
  }

  getAdvance(id: number): Observable<Advance> {
    return this.http.get<Advance>(`${this.apiUrl}/${id}`);
  }

  getAdvancesBySupplier(SupplierId: number): Observable<Advance[]> {
    return this.http.get<Advance[]>(`${this.apiUrl}/supplier/${SupplierId}`);
  }

  createAdvance(advance: Advance): Observable<Advance> {
    return this.http.post<Advance>(this.apiUrl, advance);
  }

  updateAdvance(advance: Advance): Observable<Advance> {
    return this.http.put<Advance>(`${this.apiUrl}/${advance.advanceId}`, advance);
  }

  deleteAdvance(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deductFromAdvance(id: number, amount: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {});
  }

  getTotalAdvancesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getTotalOutstandingAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`);
  }

  getTotalRecoveredAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalRecovered`);
  }

  getTotalOutstandingAdvances(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`);
  }
}
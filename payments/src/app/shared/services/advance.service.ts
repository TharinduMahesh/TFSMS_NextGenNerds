
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advance } from '../../models/advance.model';

@Injectable({
  providedIn: 'root'
})
export class AdvanceService {
  private apiUrl = "http://localhost:5274/api/advances";

  constructor(private http: HttpClient) { }

  getAdvances(): Observable<Advance[]> {
    return this.http.get<Advance[]>(this.apiUrl);
  }

  getAdvance(id: number): Observable<Advance> {
    return this.http.get<Advance>(`${this.apiUrl}/${id}`);
  }

  getAdvancesBySupplier(supplierId: number): Observable<Advance[]> {
    return this.http.get<Advance[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  deductFromAdvance(id: number, amount: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {});
  }

  getTotalOutstandingAdvances(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalOutstanding`);
  }
}
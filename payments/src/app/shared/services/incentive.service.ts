
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incentive } from '../../models/incentive.model';

@Injectable({
  providedIn: 'root'
})
export class IncentiveService {
  private apiUrl = "http://localhost:5274/api/incentives";

  constructor(private http: HttpClient) { }

  getIncentives(): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(this.apiUrl);
  }

  getIncentive(id: number): Observable<Incentive> {
    return this.http.get<Incentive>(`${this.apiUrl}/${id}`);
  }

  getIncentivesBySupplier(supplierId: number): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  getCurrentIncentiveForSupplier(supplierId: number): Observable<Incentive> {
    return this.http.get<Incentive>(`${this.apiUrl}/supplier/${supplierId}/current`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incentive } from '../../models/incentive.model';

@Injectable({
  providedIn: 'root'
})
export class IncentiveService {
  private apiUrl = "https://localhost:7203/incentives";

  constructor(private http: HttpClient) { }

  getAllIncentives(): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(this.apiUrl);
  }

  getIncentives(): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(this.apiUrl);
  }

  getIncentive(id: number): Observable<Incentive> {
    return this.http.get<Incentive>(`${this.apiUrl}/${id}`);
  }

  getIncentivesBySupplier(SupplierId: number): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(`${this.apiUrl}/supplier/${SupplierId}`);
  }

  getCurrentIncentiveForSupplier(SupplierId: number): Observable<Incentive> {
    return this.http.get<Incentive>(`${this.apiUrl}/supplier/${SupplierId}/current`);
  }

  createIncentive(incentive: Incentive): Observable<Incentive> {
    return this.http.post<Incentive>(this.apiUrl, incentive);
  }

  updateIncentive(incentive: Incentive): Observable<Incentive> {
    return this.http.put<Incentive>(`${this.apiUrl}/${incentive.incentiveId}`, incentive);
  }

  deleteIncentive(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTotalIncentivesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getTotalQualityBonusAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalQualityBonus`);
  }

  getTotalLoyaltyBonusAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalLoyaltyBonus`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Incentive } from '../../models/incentive.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncentiveService {
  // Fixed API URL - was missing /api
  private apiUrl = `${environment.apiBaseUrl}/api/incentives`;

  constructor(private http: HttpClient) { }

  getAllIncentives(): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error('Error fetching all incentives:', error);
        return of([]);
      })
    );
  }

  // Removed duplicate getIncentives() method

  getIncentive(id: number): Observable<Incentive | null> {
    return this.http.get<Incentive>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching incentive with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getIncentivesBySupplier(supplierId: number): Observable<Incentive[]> {
    return this.http.get<Incentive[]>(`${this.apiUrl}/supplier/${supplierId}`).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error(`Error fetching incentives for supplier ${supplierId}:`, error);
        return of([]);
      })
    );
  }

  getCurrentIncentiveForSupplier(supplierId: number): Observable<Incentive | null> {
    return this.http.get<Incentive>(`${this.apiUrl}/supplier/${supplierId}/current`).pipe(
      catchError(error => {
        console.error(`Error fetching current incentive for supplier ${supplierId}:`, error);
        return of(null);
      })
    );
  }

  createIncentive(incentive: Incentive): Observable<Incentive | null> {
    return this.http.post<Incentive>(this.apiUrl, incentive).pipe(
      catchError(error => {
        console.error('Error creating incentive:', error);
        return of(null);
      })
    );
  }

  updateIncentive(incentive: Incentive): Observable<Incentive | null> {
    return this.http.put<Incentive>(`${this.apiUrl}/${incentive.IncentiveId}`, incentive).pipe(
      catchError(error => {
        console.error(`Error updating incentive with id ${incentive.IncentiveId}:`, error);
        return of(null);
      })
    );
  }

  deleteIncentive(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting incentive with id ${id}:`, error);
        return of(false);
      })
    );
  }

  getTotalIncentivesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total incentives count:', error);
        return of(0);
      })
    );
  }

  getTotalQualityBonusAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalQualityBonus`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total quality bonus amount:', error);
        return of(0);
      })
    );
  }

  getTotalLoyaltyBonusAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalLoyaltyBonus`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total loyalty bonus amount:', error);
        return of(0);
      })
    );
  }
}
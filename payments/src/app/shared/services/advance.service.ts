import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Advance } from '../../models/advance.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdvanceService {
  private apiUrl = `${environment.apiBaseUrl}/api/Advances`;

  constructor(private http: HttpClient) { }

  getAllAdvances(): Observable<Advance[]> {
    return this.http.get<Advance[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error('Error fetching all advances:', error);
        return of([]);
      })
    );
  }

  // Removed duplicate getAdvances() method

  getAdvance(id: number): Observable<Advance | null> {
    return this.http.get<Advance>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching advance with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getAdvancesBySupplier(SupplierId: number): Observable<Advance[]> {
    return this.http.get<Advance[]>(`${this.apiUrl}/supplier/${SupplierId}`).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error(`Error fetching advances for supplier ${SupplierId}:`, error);
        return of([]);
      })
    );
  }

  createAdvance(advance: Advance): Observable<Advance | null> {
    return this.http.post<Advance>(this.apiUrl, advance).pipe(
      catchError(error => {
        console.error('Error creating advance:', error);
        return of(null);
      })
    );
  }

  updateAdvance(advance: Advance): Observable<Advance | null> {
    return this.http.put<Advance>(`${this.apiUrl}/${advance.advanceId}`, advance).pipe(
      catchError(error => {
        console.error(`Error updating advance with id ${advance.advanceId}:`, error);
        return of(null);
      })
    );
  }

  deleteAdvance(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting advance with id ${id}:`, error);
        return of(false);
      })
    );
  }

  deductFromAdvance(id: number, amount: number): Observable<boolean> {
    return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {}).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deducting ${amount} from advance with id ${id}:`, error);
        return of(false);
      })
    );
  }

  getTotalAdvancesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total advances count:', error);
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

  getTotalRecoveredAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalRecovered`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total recovered amount:', error);
        return of(0);
      })
    );
  }

  // Removed duplicate getTotalOutstandingAdvances() method as it's the same as getTotalOutstandingAmount()
}
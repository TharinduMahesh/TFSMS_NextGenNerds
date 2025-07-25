import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { YieldResponse, YieldPayload } from '../../models/Logistic and Transport/RouteYeildMaintain.model';

@Injectable({
  providedIn: 'root',
})
export class RyService { // Or rename to YieldService for consistency
  private apiUrl = 'https://localhost:7263/api/routeyieldmaintain';

  constructor(private http: HttpClient) {}

  getAllYieldLists(): Observable<YieldResponse[]> {
    return this.http.get<YieldResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getYieldListById(id: number): Observable<YieldResponse> {
    return this.http.get<YieldResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createYieldList(yieldPayload: YieldPayload): Observable<YieldResponse> {
    return this.http.post<YieldResponse>(this.apiUrl, yieldPayload).pipe(catchError(this.handleError));
  }

  updateYieldList(id: number, yieldPayload: YieldPayload): Observable<YieldResponse> {
    return this.http.put<YieldResponse>(`${this.apiUrl}/${id}`, yieldPayload).pipe(catchError(this.handleError));
  }

  deleteYieldList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Using the standardized error handler
    const errorMessage = error.error?.message || error.error?.title || error.message || 'An unknown server error occurred.';
    console.error('API Error in RyService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RtList, CreateUpdateRoutePayload } from '../../models/Logistic and Transport/RouteMaintain.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'https://localhost:7263/api/routemaintain'; // Ensure port is correct

  constructor(private http: HttpClient) { }

  getAllRoutes(): Observable<RtList[]> {
    return this.http.get<RtList[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<RtList> {
    return this.http.get<RtList>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createRoute(payload: CreateUpdateRoutePayload): Observable<RtList> {
    return this.http.post<RtList>(this.apiUrl, payload).pipe(catchError(this.handleError));
  }

  // CORRECTION: The backend returns the updated route object, so the type here should be Observable<RtList>.
  updateRoute(id: number, payload: CreateUpdateRoutePayload): Observable<RtList> {
    return this.http.put<RtList>(`${this.apiUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Standardized, more detailed error message
    const errorMessage = error.error?.message || error.error?.title || error.message || 'An unknown server error occurred.';
    console.error('API Error in RouteService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
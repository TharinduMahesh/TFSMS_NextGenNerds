import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RtList, CreateUpdateRouteDto } from '../../models/Logistic and Transport/RouteMaintain.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'https://localhost:7263/api/routemaintain';

  constructor(private http: HttpClient) { }

  getAllRoutes(): Observable<RtList[]> {
    return this.http.get<RtList[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<RtList> {
    return this.http.get<RtList>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createRoute(payload: CreateUpdateRouteDto): Observable<RtList> {
    return this.http.post<RtList>(this.apiUrl, payload).pipe(catchError(this.handleError));
  }

  updateRoute(id: number, payload: CreateUpdateRouteDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      if (error.status === 400 && error.error?.title) {
        errorMessage = `Error: ${error.error.title}`;
      } else {
        errorMessage = `Server error: Code ${error.status}, Message: ${error.message}`;
      }
    }
    console.error(errorMessage, error.error);
    return throwError(() => new Error(errorMessage));
  }
}
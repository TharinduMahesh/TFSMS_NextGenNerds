import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Rview } from '../../models/rview.model';

@Injectable({
  providedIn: 'root'
})
export class RService {
  private apiUrl = 'https://localhost:7263/api/rview';

  constructor(private http: HttpClient) { }

  // Get all routes with error handling
  getAll(): Observable<Rview[]> {
    return this.http.get<Rview[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get single route by ID
  getById(id: number): Observable<Rview> {
    return this.http.get<Rview>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new route
  create(rview: Rview): Observable<Rview> {
    return this.http.post<Rview>(this.apiUrl, rview).pipe(
      catchError(this.handleError)
    );
  }

  // Update existing route
  update(id: number, rview: Rview): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, rview).pipe(
      catchError(this.handleError)
    );
  }

  // Delete route
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Centralized error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Customize messages for specific status codes
      switch (error.status) {
        case 404:
          errorMessage = 'Route not found';
          break;
        case 400:
          errorMessage = 'Bad request - please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - please login';
          break;
        case 403:
          errorMessage = 'Forbidden - insufficient permissions';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
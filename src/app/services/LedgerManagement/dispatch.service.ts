import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateDispatchPayload, DispatchResponse } from '../../models/Ledger Management/dispatch.model';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7263/api/dispatches'; // Example port

  // Method for the 'dispatch-entry' page
  createDispatch(payload: CreateDispatchPayload): Observable<DispatchResponse> {
    return this.http.post<DispatchResponse>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.message || 'An unknown server error occurred.';
    console.error('DispatchService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
// src/app/Services/supplier.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Supplier } from '../models/supplier.interface'; // Import the Supplier interface

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:5105/api/suppliers'; // **IMPORTANT: Backend API endpoint**

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Fetches a list of unique suppliers for the dropdown.
   * @returns An Observable of an array of Supplier objects (with basic info).
   */
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Fetches initial weights for a specific supplier (latest available date).
   * FIX: Removed 'date' parameter from here.
   * @param supplierId The ID of the supplier.
   * @returns An Observable of a Supplier object containing initial weights.
   */
  getInitialWeights(supplierId: number): Observable<Supplier> { // Removed date parameter
    let params = new HttpParams();
    params = params.append('supplierId', supplierId.toString());
    // Removed: params = params.append('date', date);

    return this.http.get<Supplier>(`${this.apiUrl}/initial-weights`, { params: params }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error in SupplierService:', error);
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      if (error.status) {
        errorMessage = `Server returned code ${error.status}: ${error.statusText || 'Unknown Error'}`;
      }
      if (error.error && typeof error.error === 'object') {
        if ((error.error as any).Message) {
          errorMessage = `Server responded: ${(error.error as any).Message}`;
        } else if ((error.error as any).errors) {
          const validationErrors = Object.values((error.error as any).errors).flat();
          errorMessage = `Validation errors: ${validationErrors.join('; ')}`;
        } else if (error.error instanceof ProgressEvent) {
            errorMessage = `Could not connect to the backend API. Is the server running at ${this.apiUrl}?`;
        }
      } else if (error.message) {
        errorMessage = `HTTP error: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}

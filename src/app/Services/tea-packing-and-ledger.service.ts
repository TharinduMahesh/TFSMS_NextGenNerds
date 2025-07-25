// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface TeaPackingLedger {
//   saleId: string;
//   buyerName: string;
//   kilosSold: number;
//   soldPriceKg: number;
//   transactionType: string;
//   saleDate: string;
//   status: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TeaPackingLedgerService {
//   private apiUrl = 'http://localhost:5105/api/teapackingledger';

//   constructor(private http: HttpClient) {}

//   getLedgers(): Observable<TeaPackingLedger[]> {
//     return this.http.get<TeaPackingLedger[]>(this.apiUrl);
//   }

//   getLedger(saleId: string): Observable<TeaPackingLedger> {
//     return this.http.get<TeaPackingLedger>(`${this.apiUrl}/${saleId}`);
//   }

//   createLedger(ledger: TeaPackingLedger): Observable<TeaPackingLedger> {
//     return this.http.post<TeaPackingLedger>(this.apiUrl, ledger);
//   }

//   updateLedger(ledger: TeaPackingLedger): Observable<void> {
//     return this.http.put<void>(`${this.apiUrl}/${ledger.saleId}`, ledger);
//   }

//   deleteLedger(saleId: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${saleId}`);
//   }
// }

import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // ADD PLATFORM_ID, Inject
import { isPlatformBrowser } from '@angular/common'; // ADD isPlatformBrowser
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // ADD HttpHeaders, HttpErrorResponse
import { Observable, catchError, throwError } from 'rxjs'; // ADD catchError, throwError

export interface TeaPackingLedger {
  saleId: string;
  buyerName: string;
  kilosSold: number;
  soldPriceKg: number;
  transactionType: string;
  saleDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeaPackingLedgerService {
  private apiUrl = 'http://localhost:5105/api/teapackingledger';

  // CHANGE: Inject PLATFORM_ID into the constructor
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // ADD: Helper for common headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getLedgers(): Observable<TeaPackingLedger[]> {
    return this.http.get<TeaPackingLedger[]>(this.apiUrl).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in getLedgers:', error);
        let errorMessage = 'Failed to load ledger records. Please try again.';

        if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
          errorMessage = `Network error: ${error.error.message}`;
        } else if (error.error && typeof error.error === 'object' && error.error.Message) {
          errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
          errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getLedger(saleId: string): Observable<TeaPackingLedger> {
    return this.http.get<TeaPackingLedger>(`${this.apiUrl}/${saleId}`).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in getLedger:', error);
        let errorMessage = 'Failed to retrieve ledger record. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  createLedger(ledger: TeaPackingLedger): Observable<TeaPackingLedger> {
    // CHANGE: Add headers for POST request
    return this.http.post<TeaPackingLedger>(this.apiUrl, ledger, {
      headers: this.getHeaders() // ADD headers
    }).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in createLedger:', error);
        let errorMessage = 'Failed to create ledger record. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateLedger(ledger: TeaPackingLedger): Observable<void> {
    // CHANGE: Add headers for PUT request
    return this.http.put<void>(`${this.apiUrl}/${ledger.saleId}`, ledger, {
      headers: this.getHeaders() // ADD headers
    }).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in updateLedger:', error);
        let errorMessage = 'Failed to update ledger record. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteLedger(saleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${saleId}`).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in deleteLedger:', error);
        let errorMessage = 'Failed to delete ledger record. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
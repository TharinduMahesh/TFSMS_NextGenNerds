// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
// import { Observable,throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { Claim } from '../models/claim.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ClaimsService {
//   private apiUrl = 'http://localhost:5105/api/claims';

//   constructor(private http: HttpClient) {}

//   getClaims(): Observable<Claim[]> {
//     return this.http.get<Claim[]>(this.apiUrl).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('API Error:', error);
//         return throwError(() => new Error('Failed to load claims. Please try again.'));
//       })
//     );
//   }

//   private getHeaders(): HttpHeaders {
//     return new HttpHeaders({
//       'Content-Type': 'application/json'
//     });
//   }

  

  
//   getClaim(id: number): Observable<Claim> {
//     return this.http.get<Claim>(`${this.apiUrl}/${id}`);
//   }

//   createClaim(claim: Claim): Observable<Claim> {
//     return this.http.post<Claim>(this.apiUrl, claim, {
//       headers: this.getHeaders()
//     });
//   }

//   updateClaim(claim: Claim): Observable<void> {
//     return this.http.put<void>(`${this.apiUrl}/${claim.id}`, claim, {
//       headers: this.getHeaders()
//     });
//   }

//   deleteClaim(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }

import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // ADD PLATFORM_ID, Inject
import { isPlatformBrowser } from '@angular/common'; // ADD isPlatformBrowser
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // ADD HttpErrorResponse if not already present
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Keep this import for now, though direct rxjs import is newer
import { Claim } from '../models/claim.interface';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private apiUrl = 'http://localhost:5105/api/claims';

  // CHANGE: Inject PLATFORM_ID into the constructor
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API error in getClaims:', error); // More specific console log
        let errorMessage = 'Failed to load claims. Please try again.';

        // **FIX: Use isPlatformBrowser to guard the ErrorEvent check**
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

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getClaim(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in getClaim:', error);
        let errorMessage = 'Failed to retrieve claim. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  createClaim(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim, {
      headers: this.getHeaders()
    }).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in createClaim:', error);
        let errorMessage = 'Failed to create claim. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateClaim(claim: Claim): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${claim.id}`, claim, {
      headers: this.getHeaders()
    }).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in updateClaim:', error);
        let errorMessage = 'Failed to update claim. Please try again.';
        if (error.error && typeof error.error === 'object' && error.error.Message) {
            errorMessage = `Server responded: ${error.error.Message}`;
        } else if (error.message) {
            errorMessage = `HTTP error: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      // ADD: Comprehensive error handling
      catchError((error: HttpErrorResponse) => {
        console.error('API error in deleteClaim:', error);
        let errorMessage = 'Failed to delete claim. Please try again.';
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
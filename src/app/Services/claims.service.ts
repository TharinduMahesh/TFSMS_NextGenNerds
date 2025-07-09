import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Claim } from '../models/claim.interface';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private apiUrl = 'http://localhost:5105/api/claims';

  constructor(private http: HttpClient) {}

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load claims. Please try again.'));
      })
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  

  
  getClaim(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`);
  }

  createClaim(claim: Claim): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim, {
      headers: this.getHeaders()
    });
  }

  updateClaim(claim: Claim): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${claim.id}`, claim, {
      headers: this.getHeaders()
    });
  }

  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
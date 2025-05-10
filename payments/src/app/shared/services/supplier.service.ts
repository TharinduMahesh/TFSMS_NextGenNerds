import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Supplier } from '../../models/supplier.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiBaseUrl}/suppliers`;

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error('Error fetching suppliers:', error);
        return of([]);
      })
    );
  }

  getActiveSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/active`).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error('Error fetching active suppliers:', error);
        return of([]);
      })
    );
  }

  getSupplier(id: number): Observable<Supplier | null> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching supplier with id ${id}:`, error);
        return of(null);
      })
    );
  }

  searchSuppliers(term: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/search?term=${term}`).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error(`Error searching suppliers with term "${term}":`, error);
        return of([]);
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Supplier } from '../../models/supplier.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  // Fix the URL to include 'api/' prefix
  private apiUrl = `${environment.apiBaseUrl}/api/Suppliers`;

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(response => console.log('Raw supplier response:', response)), // Debug log
      map(response => {
        // Extract the $values array from the response
        const suppliers = response.$values || [];
        console.log('Extracted suppliers array:', suppliers);
        return suppliers.map((supplier: any) => this.mapSupplier(supplier));
      }),
      catchError(error => {
        console.error('Error fetching suppliers:', error);
        return of([]);
      })
    );
  }

  getActiveSuppliers(): Observable<Supplier[]> {
    return this.http.get<any>(`${this.apiUrl}/active`).pipe(
      tap(response => console.log('Raw active supplier response:', response)), // Debug log
      map(response => {
        // Extract the $values array from the response
        const suppliers = response.$values || [];
        console.log('Extracted active suppliers array:', suppliers);
        return suppliers.map((supplier: any) => this.mapSupplier(supplier));
      }),
      catchError(error => {
        console.error('Error fetching active suppliers:', error);
        return of([]);
      })
    );
  }

  getSupplier(id: number): Observable<Supplier | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(supplier => this.mapSupplier(supplier)),
      catchError(error => {
        console.error(`Error fetching supplier with id ${id}:`, error);
        return of(null);
      })
    );
  }

  searchSuppliers(term: string): Observable<Supplier[]> {
    return this.http.get<any>(`${this.apiUrl}/search?term=${term}`).pipe(
      map(response => {
        // Extract the $values array from the response
        const suppliers = response.$values || [];
        return suppliers.map((supplier: any) => this.mapSupplier(supplier));
      }),
      catchError(error => {
        console.error(`Error searching suppliers with term "${term}":`, error);
        return of([]);
      })
    );
  }

  // Helper method to normalize property names
  private mapSupplier(data: any): Supplier {
    return {
      SupplierId: data.SupplierId,
      Name: data.Name,
      // Add any other properties needed
    };
  }

  
}
// src/app/Services/green-leaf-collection.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GreenLeafCollection } from '../models/green-leaf-collection.interface'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class GreenLeafCollectionService {
  private apiUrl = 'http://localhost:5105/api/greenleafcollections'; // **IMPORTANT: Backend API endpoint**

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Fetches all green leaf collection records.
   * @returns An Observable of an array of GreenLeafCollection objects.
   */
  getGreenLeafCollections(): Observable<GreenLeafCollection[]> {
    return this.http.get<GreenLeafCollection[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Adds a new green leaf collection record.
   * @param collection The GreenLeafCollection object to add.
   * @returns An Observable of the newly created GreenLeafCollection object.
   */
  addGreenLeafCollection(collection: GreenLeafCollection): Observable<GreenLeafCollection> {
    return this.http.post<GreenLeafCollection>(this.apiUrl, collection, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Updates an existing green leaf collection record.
   * @param id The ID of the record to update.
   * @param collection The updated GreenLeafCollection object.
   * @returns An Observable of void upon successful update.
   */
  updateGreenLeafCollection(id: number, collection: GreenLeafCollection): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, collection, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Deletes a green leaf collection record.
   * @param id The ID of the record to delete.
   * @returns An Observable of void upon successful deletion.
   */
  deleteGreenLeafCollection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API error in GreenLeafCollectionService:', error);
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

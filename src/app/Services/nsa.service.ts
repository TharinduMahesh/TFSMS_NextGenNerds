// src/app/Services/nsa.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Used for SSR checks
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NsaEntry } from '../models/nsa-entry.interface'; // Import the NSA Entry interface

@Injectable({
  providedIn: 'root' // Makes this service available throughout your application
})
export class NsaService {
  // **IMPORTANT:** Define your backend API endpoint here.
  // This should match the URL where your .NET API is running (e.g., from launchSettings.json)
  private apiUrl = 'http://localhost:5105/api/nsaentries';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Helper method to get standard HTTP headers (e.g., for JSON content)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Fetches all existing NSA entries from the backend.
   * @returns An Observable of an array of NsaEntry objects.
   */
  getNsaEntries(): Observable<NsaEntry[]> {
    return this.http.get<NsaEntry[]>(this.apiUrl).pipe(
      catchError(this.handleError.bind(this)) // Bind 'this' for handleError
    );
  }

  /**
   * Adds a new NSA entry to the backend.
   * @param nsaEntry The NsaEntry object to add.
   * @returns An Observable of the newly created NsaEntry object (with ID from backend).
   */
  addNsaEntry(nsaEntry: NsaEntry): Observable<NsaEntry> {
    return this.http.post<NsaEntry>(this.apiUrl, nsaEntry, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Updates an existing NSA entry on the backend.
   * @param id The ID of the NSA entry to update.
   * @param nsaEntry The updated NsaEntry object.
   * @returns An Observable of the updated NsaEntry object.
   */
  updateNsaEntry(id: number, nsaEntry: NsaEntry): Observable<NsaEntry> {
    return this.http.put<NsaEntry>(`${this.apiUrl}/${id}`, nsaEntry, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Deletes an NSA entry from the backend.
   * @param id The ID of the NSA entry to delete.
   * @returns An Observable of void (empty response) upon successful deletion.
   */
  deleteNsaEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Centralized error handling for HTTP requests.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An API error occurred:', error); // Log the full error object

    let errorMessage = 'An unknown error occurred. Please try again.';

    if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
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

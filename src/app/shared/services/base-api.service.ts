// Create a new file: base-api.service.ts
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class BaseApiService {
  protected handleArrayResponse<T>(response: any): T[] {
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
      // Handle case where response is { data: [...] }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // Handle case where response is a single object that should be in an array
      if (Object.keys(response).length > 0) {
        return [response];
      }
    }
    // Default to empty array if response is null/undefined or not convertible
    return [];
  }

  protected handleSingleResponse<T>(response: any): T {
    if (response && typeof response === 'object') {
      // If it has a data property, return that, otherwise return the whole object
      return response.data || response;
    }
    return response as T;
  }

  protected handleNumberResponse(response: any): number {
    if (typeof response === 'number') {
      return response;
    } else if (response && typeof response === 'object') {
      return typeof response.data === 'number' ? response.data : 0;
    }
    return 0;
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CollectorResponse, CreateUpdateCollectorPayload} from '../../models/Logistic and Transport/CollectorManagement.model';
import { CreateUpdateVehiclePayload, VehicleResponse} from '../../models/Logistic and Transport/VehicleManagement.model';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private collectorsApiUrl = 'https://localhost:7263/api/Collectors';
  private vehiclesApiUrl = 'https://localhost:7263/api/Vehicles';

  constructor(private http: HttpClient) { }

  getAllCollectors(): Observable<CollectorResponse[]> {
    return this.http.get<CollectorResponse[]>(this.collectorsApiUrl).pipe(catchError(this.handleError));
  }

  getCollectorById(id: number): Observable<CollectorResponse> {
    return this.http.get<CollectorResponse>(`${this.collectorsApiUrl}/${id}`).pipe(catchError(this.handleError));
  }
  
  createCollector(payload: CreateUpdateCollectorPayload): Observable<CollectorResponse> {
    return this.http.post<CollectorResponse>(this.collectorsApiUrl, payload).pipe(catchError(this.handleError));
  }

  updateCollector(id: number, payload: CreateUpdateCollectorPayload): Observable<CollectorResponse> {
    return this.http.put<CollectorResponse>(`${this.collectorsApiUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

   deleteCollector(id: number): Observable<void> {
    return this.http.delete<void>(`${this.collectorsApiUrl}/${id}`).pipe(catchError(this.handleError));
  }
  
  // --- Vehicle Methods ---

  createVehicle(payload: CreateUpdateVehiclePayload): Observable<VehicleResponse> {
    return this.http.post<VehicleResponse>(this.vehiclesApiUrl, payload).pipe(catchError(this.handleError));
  }

  updateVehicle(id: number, payload: CreateUpdateVehiclePayload): Observable<VehicleResponse> {
    return this.http.put<VehicleResponse>(`${this.vehiclesApiUrl}/${id}`, payload).pipe(catchError(this.handleError));
  }

  // --- Common Error Handler ---

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.error?.title || error.message || 'An unknown server error occurred.';
    console.error('API Error in CollectorService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

// Import all Trip and Report models
// Assuming you've organized them into these files as we discussed
import { 
  TripResponse, 
  ScheduleTripPayload, 
  UpdateTripStatusPayload 
} from '../../models/Logistic and Transport/TripTracking.model';
import { 
  CollectorCostReport, 
  CollectorPerformanceReport, 
  RoutePerformanceReport 
} from '../../models/Logistic and Transport/TransportReports.model';

@Injectable({
  providedIn: 'root'
})
export class TransportReportService {
  private tripsApiUrl = 'https://localhost:7263/api/TripRecords';
  private reportsApiUrl = 'https://localhost:7263/api/TransportReports';

  constructor(private http: HttpClient) { }

  // --- Trip Management Methods ---

  scheduleTrip(payload: ScheduleTripPayload): Observable<TripResponse> {
    return this.http.post<TripResponse>(`${this.tripsApiUrl}/schedule`, payload).pipe(catchError(this.handleError));
  }

  updateTripStatus(tripId: number, payload: UpdateTripStatusPayload): Observable<TripResponse> {
    return this.http.put<TripResponse>(`${this.tripsApiUrl}/${tripId}/status`, payload).pipe(catchError(this.handleError));
  }

  getAllTrips(): Observable<TripResponse[]> {
    return this.http.get<TripResponse[]>(this.tripsApiUrl).pipe(catchError(this.handleError));
  }

 
  deleteTrip(tripId: number): Observable<void> {
    return this.http.delete<void>(`${this.tripsApiUrl}/${tripId}`).pipe(catchError(this.handleError));
  }

  // --- Reporting Methods ---

  getCostByCollector(startDate: string, endDate: string): Observable<CollectorCostReport[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<CollectorCostReport[]>(`${this.reportsApiUrl}/costs-by-collector`, { params }).pipe(catchError(this.handleError));
  }
  
  getPerformanceByCollector(startDate: string, endDate: string): Observable<CollectorPerformanceReport[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<CollectorPerformanceReport[]>(`${this.reportsApiUrl}/performance-by-collector`, { params }).pipe(catchError(this.handleError));
  }
  
  getPerformanceByRoute(startDate: string, endDate: string): Observable<RoutePerformanceReport[]> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<RoutePerformanceReport[]>(`${this.reportsApiUrl}/performance-by-route`, { params }).pipe(catchError(this.handleError));
  }
  
  // --- Common Error Handler ---
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.error?.title || error.message || 'An unknown server error occurred.';
    console.error('API Error in TransportReportService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
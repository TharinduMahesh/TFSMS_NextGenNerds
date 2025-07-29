import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GrowerMapPoint, PendingGrowerOrder } from '../../models/Logistic and Transport/Grower.model';

@Injectable({
  providedIn: 'root'
})
export class GrowerService {
  private growerApiUrl = 'https://localhost:7263/api/grower';

  constructor(private http: HttpClient) {}

  getPendingGrowerLocations(): Observable<GrowerMapPoint[]> {
    return this.http.get<GrowerMapPoint[]>(`${this.growerApiUrl}/pending-locations`)
      .pipe(catchError(this.handleError));
  }

  getPendingOrdersWithLocations(): Observable<PendingGrowerOrder[]> {
    return this.http.get<PendingGrowerOrder[]>(`${this.growerApiUrl}/pending-orders`)
      .pipe(catchError(this.handleError));
  }

  getGrowersByCity(city: string): Observable<GrowerMapPoint[]> {
    return this.http.get<GrowerMapPoint[]>(`${this.growerApiUrl}/pending-locations?city=${encodeURIComponent(city)}`)
      .pipe(catchError(this.handleError));
  }

  getGrowersInRadius(latitude: number, longitude: number, radiusKm: number): Observable<GrowerMapPoint[]> {
    const params = {
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radiusKm.toString()
    };
    
    return this.http.get<GrowerMapPoint[]>(`${this.growerApiUrl}/pending-locations/radius`, { params })
      .pipe(catchError(this.handleError));
  }

  getPendingOrdersSummary(): Observable<any> {
    return this.http.get<any>(`${this.growerApiUrl}/pending-orders/summary`)
      .pipe(catchError(this.handleError));
  }

  formatForMap(growers: GrowerMapPoint[]): GrowerMapPoint[] {
    return growers.filter(grower => 
      grower.latitude && 
      grower.longitude && 
      grower.latitude !== 0 && 
      grower.longitude !== 0
    );
  }

  calculateTotals(growers: GrowerMapPoint[]): { totalSuperTea: number; totalGreenTea: number; totalOrders: number } {
    return growers.reduce((totals, grower) => ({
      totalSuperTea: totals.totalSuperTea + grower.totalSuperTea,
      totalGreenTea: totals.totalGreenTea + grower.totalGreenTea,
      totalOrders: totals.totalOrders + grower.pendingOrdersCount
    }), { totalSuperTea: 0, totalGreenTea: 0, totalOrders: 0 });
  }

  groupGrowersByCity(growers: GrowerMapPoint[]): { [city: string]: GrowerMapPoint[] } {
    return growers.reduce((groups, grower) => {
      const city = this.extractCityFromAddress(grower.address);
      if (!groups[city]) {
        groups[city] = [];
      }
      groups[city].push(grower);
      return groups;
    }, {} as { [city: string]: GrowerMapPoint[] });
  }

  private extractCityFromAddress(address: string): string {
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : 'Unknown';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message || error.error?.title || error.message || 'An unknown server error occurred.';
    console.error('API Error in GrowerService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
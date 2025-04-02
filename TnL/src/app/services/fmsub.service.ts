import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Route {
  routeName: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  timeDuration: string;
  stops: number;
  supplierLocations: string[];
  transporter: string;
  vehicle: string;
  routeStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  // Dummy data storage
  private dummyRoutes: Route[] = [];

  // Dummy options for dropdowns
  getSupplierLocations(): string[] {
    return ['Warehouse A', 'Factory B', 'Distribution Center C'];
  }

  getTransporters(): string[] {
    return ['Fast Transports', 'Eco Logistics', 'Global Shippers'];
  }

  getVehicles(): string[] {
    return ['Truck-001', 'Van-202', 'Trailer-X3'];
  }

  getStatusOptions(): string[] {
    return ['Active', 'Inactive', 'Completed', 'Pending'];
  }

  // Simulate API call with delay
  saveRoute(routeData: Route): Observable<any> {
    // Add to dummy storage
    this.dummyRoutes.push(routeData);
    
    // Simulate API response
    return of({
      success: true,
      message: 'Route saved successfully (simulated)',
      id: Date.now() // Generate fake ID
    }).pipe(delay(1000)); // Simulate network delay
  }

  // Optional: Method to get dummy data for display
  getRoutes(): Observable<Route[]> {
    return of(this.dummyRoutes).pipe(delay(500));
  }
}
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin } from 'rxjs';

// Import all necessary services and models
import { CollectorService } from '../../services/LogisticAndTransport/Collector.service';
import { VehicleService } from '../../services/LogisticAndTransport/Vehicle.service';
import { RouteService } from '../../services/LogisticAndTransport/RouteMaintain.service';
import { TransportReportService } from '../../services/LogisticAndTransport/TransportReport.service';
import { TripResponse } from '../../models/Logistic and Transport/TripTracking.model';
import { TnLNavbarComponent } from '../../components/TnLNavbar/tnlnav.component ';

// A new interface to hold all our summary data
interface DashboardSummary {
  totalCollectors: number;
  totalVehicles: number;
  totalRoutes: number;
  tripsInProgress: number;
  tripsPending: number;
  tripsCompletedToday: number;
}

@Component({
  selector: 'app-transport-dashboard',
  standalone: true,
  imports: [CommonModule, TnLNavbarComponent],
  templateUrl: './tnlDash.component.html',
  styleUrl: './tnlDash.component.scss',
})
export class TransportDashboardComponent implements OnInit {
  private collectorService = inject(CollectorService);
  private vehicleService = inject(VehicleService);
  private routeService = inject(RouteService);
  private transportService = inject(TransportReportService);

  summaryData = signal<DashboardSummary | null>(null);
  recentTrips = signal<TripResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Fetch all data sources in parallel for speed
    forkJoin({
      collectors: this.collectorService.getAllCollectors(),
      vehicles: this.vehicleService.getAllVehicles(),
      routes: this.routeService.getAllRoutes(),
      trips: this.transportService.getAllTrips(),
    }).subscribe({
      next: ({ collectors, vehicles, routes, trips }) => {
        // Calculate summary metrics
        const today = new Date().toDateString();

        const summary: DashboardSummary = {
          totalCollectors: collectors.length,
          totalVehicles: vehicles.length,
          totalRoutes: routes.length,
          tripsInProgress: trips.filter(t => t.actualDeparture && !t.actualArrival).length,
          tripsPending: trips.filter(t => !t.actualDeparture).length,
          tripsCompletedToday: trips.filter(t => 
            t.actualArrival && new Date(t.actualArrival).toDateString() === today
          ).length,
        };
        
        this.summaryData.set(summary);

        // Get the 5 most recently scheduled trips for the activity list
        this.recentTrips.set(
            [...trips]
            .sort((a, b) => new Date(b.scheduledDeparture).getTime() - new Date(a.scheduledDeparture).getTime())
            .slice(0, 5)
        );

        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dashboard data.');
        this.isLoading.set(false);
      },
    });
  }
}
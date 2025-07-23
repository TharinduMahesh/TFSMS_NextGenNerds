import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TripResponse, UpdateTripStatusPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
import { TransportReportService } from '../../../../services/LogisticAndTransport/TransportReport.service';
import { TnLNavbarComponent } from '../../../../components/TnLNavbar/tnlnav.component';

@Component({
  selector: 'app-trip-review',
  standalone: true,
  imports: [CommonModule, TnLNavbarComponent, DatePipe],
  templateUrl: './t-review.component.html',
  styleUrls: ['./t-review.component.scss']
})
export class TripReviewComponent implements OnInit {
  private transportService = inject(TransportReportService);
  private router = inject(Router);

  allTrips = signal<TripResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal(''); // Added searchTerm signal

  // Updated filteredTrips to include search logic
  filteredTrips = computed(() => {
    const trips = this.allTrips();
    const term = this.searchTerm().toLowerCase();
    
    return trips.filter(trip => 
      term === '' ||
      trip.tripId.toString().includes(term) ||
      trip.routeName?.toLowerCase().includes(term)||
      trip.collectorName?.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.fetchTrips();
  }

  fetchTrips(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.transportService.getAllTrips().subscribe({
      next: (data) => {
        this.allTrips.set(data.sort((a, b) => new Date(b.scheduledDeparture).getTime() - new Date(a.scheduledDeparture).getTime()));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  goToSchedulePage(): void {
    this.router.navigate(['/t-sched']);
  }
  
  markAsDeparted(trip: TripResponse): void {
    const payload: UpdateTripStatusPayload = { actualDeparture: new Date().toISOString() };
    this.updateTripStatus(trip.tripId, payload, 'departed');
  }

  markAsArrived(trip: TripResponse): void {
    const payload: UpdateTripStatusPayload = { actualArrival: new Date().toISOString() };
    this.updateTripStatus(trip.tripId, payload, 'arrived');
  }

  onEdit(trip: TripResponse): void {
    this.router.navigate(['/t-edit', trip.tripId]); 
  }

  onDelete(trip: TripResponse): void {
    if (!confirm(`Are you sure you want to delete Trip #${trip.tripId} for route "${trip.routeName}"?`)) {
      return;
    }

    this.transportService.deleteTrip(trip.tripId).subscribe({
      next: () => {
        this.fetchTrips();
        alert(`Trip #${trip.tripId} has been deleted.`);
      },
      error: (err) => alert(`Error deleting trip: ${err.message}`)
    });
  }

  private updateTripStatus(tripId: number, payload: UpdateTripStatusPayload, action: string): void {
    this.transportService.updateTripStatus(tripId, payload).subscribe({
      next: (updatedTrip) => {
        this.allTrips.update(trips => 
          trips.map(t => t.tripId === tripId ? updatedTrip : t)
        );
        alert(`Trip #${tripId} successfully marked as ${action}.`);
      },
      error: (err) => alert(`Error updating trip: ${err.message}`)
    });
  }
}
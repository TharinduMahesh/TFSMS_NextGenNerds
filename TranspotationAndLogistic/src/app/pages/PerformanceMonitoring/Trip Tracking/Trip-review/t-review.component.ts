import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TripResponse, UpdateTripStatusPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
import { TransportReportService } from '../../../../services/LogisticAndTransport/TransportReport.service';
import { TnLNavbarComponent } from "../../../../components/TnLNavbar/tnlnav.component ";

@Component({
  selector: 'app-trip-review',
  standalone: true,
  imports: [CommonModule, TnLNavbarComponent],
  templateUrl: './t-review.component.html',
  styleUrls: ['./t-review.component.scss']
})
export class TripReviewComponent implements OnInit {
  private transportService = inject(TransportReportService);
  private router = inject(Router);

  allTrips = signal<TripResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // You can add filtering signals here later if needed (e.g., show only 'Pending')
  filteredTrips = computed(() => this.allTrips());

  ngOnInit(): void {
    this.fetchTrips();
  }

  fetchTrips(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.transportService.getAllTrips().subscribe({
      next: (data) => {
        // Sort trips by scheduled time for better visibility
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
  
  // Marks a trip as departed now
  markAsDeparted(trip: TripResponse): void {
    const payload: UpdateTripStatusPayload = { actualDeparture: new Date().toISOString() };
    this.updateTripStatus(trip.tripId, payload, 'departed');
  }

  // Marks a trip as arrived now
  markAsArrived(trip: TripResponse): void {
    const payload: UpdateTripStatusPayload = { actualArrival: new Date().toISOString() };
    this.updateTripStatus(trip.tripId, payload, 'arrived');
  }
  
  private updateTripStatus(tripId: number, payload: UpdateTripStatusPayload, action: string): void {
    this.transportService.updateTripStatus(tripId, payload).subscribe({
      next: (updatedTrip) => {
        // Update the specific trip in our local list for immediate UI feedback
        this.allTrips.update(trips => 
          trips.map(t => t.tripId === tripId ? updatedTrip : t)
        );
        alert(`Trip #${tripId} successfully marked as ${action}.`);
      },
      error: (err) => alert(`Error updating trip: ${err.message}`)
    });
  }
}
// ==================================================
// Filename: trip-review.component.ts (FINAL - Corrected)
// ==================================================
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TripResponse, UpdateTripStatusPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
import { TransportReportService } from '../../../../Services/LogisticAndTransport/TransportReport.service';
import { TnLNavbarComponent } from '../../../../components/TnLNavbar/tnlnav.component';
import { TripViewComponent } from '../Trip-view/trip-view.compoent';

@Component({
  selector: 'app-trip-review',
  standalone: true,
  imports: [CommonModule, TnLNavbarComponent, DatePipe, TripViewComponent], 
  templateUrl: './t-review.component.html',
  styleUrls: ['./t-review.component.scss']
})
export class TripReviewComponent implements OnInit {
  private transportService = inject(TransportReportService);
  private router = inject(Router);

  allTrips = signal<TripResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  isViewModalOpen = signal(false);
  selectedTripForView = signal<TripResponse | null>(null);

  // MODIFICATION START: Sorting logic is now part of the computed signal
  filteredTrips = computed(() => {
    const trips = this.allTrips();
    const term = this.searchTerm().toLowerCase();

    // 1. First, filter the trips based on the search term
    const filtered = trips.filter(trip => 
      term === '' ||
      trip.tripId.toString().includes(term) ||
      trip.route?.rName?.toLowerCase().includes(term) ||
      trip.collectorName?.toLowerCase().includes(term)
    );

    // 2. Then, sort the filtered results to show newest first
    // We use .slice() to create a copy before sorting, which is best practice
    return filtered.slice().sort((a, b) => 
      new Date(b.scheduledDeparture).getTime() - new Date(a.scheduledDeparture).getTime()
    );
  });
  // MODIFICATION END

  ngOnInit(): void {
    this.fetchTrips();
  }

  fetchTrips(): void {
  this.isLoading.set(true);
  this.error.set(null);
  this.transportService.getAllTrips().subscribe({
    next: (data) => {
      // Sort by scheduledDeparture in descending order (newest first)
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.scheduledDeparture).getTime();
        const dateB = new Date(b.scheduledDeparture).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      
      this.allTrips.set(sortedData);
      this.isLoading.set(false);
    },
    error: (err) => {
      this.error.set('Failed to load trip data. Please try again.');
      this.isLoading.set(false);
    }
  });
}

  goToSchedulePage(): void {
    this.router.navigate(['transportedashboard/trip-schedule']);
  }
  
  markAsDeparted(trip: TripResponse): void {
    const payload: UpdateTripStatusPayload = { actualDeparture: new Date().toISOString() };
    this.updateTripStatus(trip.tripId, payload, 'departed');
  }

  markAsArrived(trip: TripResponse): void {
    const payload: UpdateTripStatusPayload = { actualArrival: new Date().toISOString() };
    this.updateTripStatus(trip.tripId, payload, 'arrived');
  }

  onDelete(trip: TripResponse): void {
    if (!confirm(`Are you sure you want to delete Trip #${trip.tripId} for route "${trip.route?.rName}"?`)) {
      return;
    }
    // Refresh the entire list after deletion to ensure consistency
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
        // When updating, we find the existing trip and replace it.
        // The computed signal will automatically re-sort the list.
        this.allTrips.update(trips => 
          trips.map(t => t.tripId === tripId ? updatedTrip : t)
        );
        alert(`Trip #${tripId} successfully marked as ${action}.`);
      },
      error: (err) => alert(`Error updating trip: ${err.message}`)
    });
  }

  onViewTrip(trip: TripResponse): void {
    this.selectedTripForView.set(trip);
    this.isViewModalOpen.set(true);
  }

  onCloseViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedTripForView.set(null);
  }
}
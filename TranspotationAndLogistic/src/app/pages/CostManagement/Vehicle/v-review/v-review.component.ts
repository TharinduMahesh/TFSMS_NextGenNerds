import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Import DecimalPipe
import { Router } from '@angular/router';

// Import services and models
import { VehicleResponse } from '../../../../models/Logistic and Transport/VehicleManagement.model';
import { VehicleService } from '../../../../services/LogisticAndTransport/Vehicle.service';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-vehicle-review',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './v-review.component.html',
  styleUrls: ['./v-review.component.scss']
})
export class VehicleReviewComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private collectorService = inject(CollectorService);
  private router = inject(Router);

  // We'll create an enriched list that includes the collector's name
  private allVehicles = signal<(VehicleResponse & { collectorName?: string })[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  filteredVehicles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.allVehicles();
    
    return this.allVehicles().filter(v =>
      v.licensePlate.toLowerCase().includes(term) ||
      (v.model && v.model.toLowerCase().includes(term)) ||
      (v.collectorName && v.collectorName.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    // Use forkJoin to get both vehicles and collectors simultaneously
    forkJoin({
      vehicles: this.vehicleService.getAllVehicles(),
      collectors: this.collectorService.getAllCollectors()
    }).pipe(
      // Use RxJS map to process the results before they reach the subscription
      map(({ vehicles, collectors }) => {
        // Create a quick lookup map of collector IDs to names
        const collectorMap = new Map(collectors.map(c => [c.collectorId, c.name]));
        // Add the collector's name to each vehicle object
        return vehicles.map(vehicle => ({
          ...vehicle,
          collectorName: collectorMap.get(vehicle.collectorId) || 'Unassigned'
        }));
      })
    ).subscribe({
      next: (enrichedVehicles) => {
        this.allVehicles.set(enrichedVehicles);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  addNewVehicle(): void {
    this.router.navigate(['/v-create']);
  }

  onEdit(vehicle: VehicleResponse): void {
    this.router.navigate(['/v-edit', vehicle.vehicleId]);
  }

  onDelete(vehicle: VehicleResponse): void {
    if (!confirm(`Are you sure you want to delete vehicle "${vehicle.licensePlate}"?`)) return;

    this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe({
      next: () => {
        this.fetchData(); // Re-fetch the data to update the list
        alert('Vehicle deleted successfully.');
      },
      error: (err) => alert(`Error deleting vehicle: ${err.message}`)
    });
  }
}
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { VehicleResponse } from '../../../../models/Logistic and Transport/VehicleManagement.model';// We will create this service next
import { VehicleService } from '../../../../services/LogisticAndTransport/Vehicle.service';
import { VehicleViewComponent } from "../v-view/v-view.component";

@Component({
  selector: 'app-vehicle-review',
  standalone: true,
  imports: [CommonModule, VehicleViewComponent],
  templateUrl: './v-review.component.html',
  styleUrls: ['./v-review.component.scss']
})
export class VehicleReviewComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  private allVehicles = signal<VehicleResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  isViewModalOpen = signal(false);
  vehicleToView = signal<VehicleResponse | null>(null);

  filteredVehicles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allVehicles().filter(v =>
      v.licensePlate.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.allVehicles.set(data);
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

  onView(vehicle: VehicleResponse): void {
    this.vehicleToView.set(vehicle);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
  }

  onEdit(vehicle: VehicleResponse): void {
    this.router.navigate(['/v-edit', vehicle.vehicleId]);
  }

  onDelete(vehicle: VehicleResponse): void {
    if (!confirm(`Are you sure you want to delete vehicle "${vehicle.licensePlate}"?`)) {
      return;
    }
    this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe({
      next: () => {
        this.fetchVehicles();
        alert('Vehicle deleted successfully.');
      },
      error: (err) => alert(`Error deleting vehicle: ${err.message}`)
    });
  }
}
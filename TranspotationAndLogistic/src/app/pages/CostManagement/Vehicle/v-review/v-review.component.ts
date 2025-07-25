import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Import necessary models and components
import { VehicleResponse, CreateUpdateVehiclePayload } from '../../../../models/Logistic and Transport/VehicleManagement.model';
import { VehicleService } from '../../../../services/LogisticAndTransport/Vehicle.service';
import { VehicleViewComponent } from '../v-view/v-view.component';
import { VehicleEditComponent } from '../v-edit/v-edit.component';
import { TnLNavbarComponent } from "../../../../components/TnLNavbar/tnlnav.component";

@Component({
  selector: 'app-vehicle-review',
  standalone: true,
  imports: [CommonModule, VehicleViewComponent, VehicleEditComponent, TnLNavbarComponent],
  templateUrl: './v-review.component.html',
  styleUrls: ['./v-review.component.scss']
})
export class VehicleReviewComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  // --- State Signals ---
  private allVehicles = signal<VehicleResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  // --- View & Edit Modal Management ---
  isViewModalOpen = signal(false);
  dataToView = signal<VehicleResponse | null>(null);
  isEditModalOpen = signal(false);
  dataToEdit = signal<VehicleResponse | null>(null);

  // --- Computed Signal for Filtering (Now works correctly) ---
  filteredVehicles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allVehicles().filter(v =>
      v.licensePlate.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term) ||
      v.collectorName?.toLowerCase().includes(term) || // This line is now valid
      v.vehicleId.toString().includes(term)
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
    this.router.navigate(['transportdashboard/v-create']);
  }

  // --- Event Handlers ---
  onView(vehicle: VehicleResponse): void {
    this.dataToView.set(vehicle);
    this.isViewModalOpen.set(true);
  }

  onEdit(vehicle: VehicleResponse): void {
    this.dataToEdit.set(vehicle);
    this.isEditModalOpen.set(true);
  }

  onDelete(vehicle: VehicleResponse): void {
    const confirmation = `Are you sure you want to delete the vehicle with license plate "${vehicle.licensePlate}"?`;
    if (!confirm(confirmation)) return;

    this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe({
      next: () => {
        this.fetchVehicles();
        alert('Vehicle deleted successfully.');
      },
      error: (err) => alert(`Error deleting vehicle: ${err.message}`)
    });
  }
  
  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.dataToView.set(null);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.dataToEdit.set(null);
  }

  handleSave(event: { vehicleId: number, payload: CreateUpdateVehiclePayload }): void {
    this.vehicleService.updateVehicle(event.vehicleId, event.payload).subscribe({
      next: () => {
        alert('Vehicle updated successfully!');
        this.fetchVehicles();
        this.closeEditModal();
      },
      error: (err) => alert(`Error updating vehicle: ${err.message}`)
    });
  }
}
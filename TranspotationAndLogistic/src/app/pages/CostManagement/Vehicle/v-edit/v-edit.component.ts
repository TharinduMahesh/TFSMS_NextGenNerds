import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { VehicleService } from '../../../../services/LogisticAndTransport/Vehicle.service';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';
import { CreateUpdateVehiclePayload } from '../../../../models/Logistic and Transport/VehicleManagement.model';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-vehicle-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './v-edit.component.html',
  styleUrls: ['./v-edit.component.scss']
})
export class VehicleEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private collectorService = inject(CollectorService);

  vehicleForm: FormGroup;
  currentVehicleId: number | null = null;
  collectors = signal<CollectorResponse[]>([]);
  isLoading = true;
  error: string | null = null;

  constructor() {
    this.vehicleForm = this.fb.group({
      collectorId: [null, Validators.required],
      licensePlate: ['', [Validators.required, Validators.maxLength(50)]],
      volume: [0, [Validators.required, Validators.min(0.1)]],
      model: ['', [Validators.maxLength(100)]],
      conditionNotes: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // 1. Fetch the list of collectors for the dropdown
    this.collectorService.getAllCollectors().subscribe(data => this.collectors.set(data));
    
    // 2. Fetch the specific vehicle's data based on the URL ID
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error = "Vehicle ID not found in URL.";
          this.isLoading = false;
          throw new Error('Vehicle ID is required');
        }
        this.currentVehicleId = +id;
        return this.vehicleService.getVehicleById(this.currentVehicleId);
      })
    ).subscribe({
      next: (vehicleData) => {
        this.vehicleForm.patchValue(vehicleData);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid || !this.currentVehicleId) return;
    
    const payload: CreateUpdateVehiclePayload = this.vehicleForm.value;
    this.vehicleService.updateVehicle(this.currentVehicleId, payload).subscribe({
      next: () => {
        alert('Vehicle updated successfully!');
        this.router.navigate(['/v-review']);
      },
      error: (err) => alert(`Error updating vehicle: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/v-review']);
  }
}
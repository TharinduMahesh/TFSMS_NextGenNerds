import { Component, OnInit, signal, inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';
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
  // This will hold ALL collectors to allow re-assignment
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
    // We need to fetch both the vehicle to edit and all possible collectors
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Vehicle ID is required');
        }
        this.currentVehicleId = +id;
        
        return forkJoin({
          vehicle: this.vehicleService.getVehicleById(this.currentVehicleId),
          collectors: this.collectorService.getAllCollectors()
        });
      })
    ).subscribe({
      next: ({ vehicle, collectors }) => {
        this.collectors.set(collectors);
        this.vehicleForm.patchValue(vehicle); // Populate form with existing data
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
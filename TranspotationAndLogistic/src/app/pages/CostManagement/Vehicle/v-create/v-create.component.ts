import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Import necessary services and models
import { VehicleService } from '../../../../services/LogisticAndTransport/Vehicle.service';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';
import { CreateUpdateVehiclePayload } from '../../../../models/Logistic and Transport/VehicleManagement.model';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-vehicle-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './v-create.component.html',
  styleUrls: ['./v-create.component.scss']
})
export class VehicleCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private collectorService = inject(CollectorService);

  vehicleForm: FormGroup;
  collectors = signal<CollectorResponse[]>([]); // To hold collectors for the dropdown

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
    // Fetch all available collectors to populate the assignment dropdown
    this.collectorService.getAllCollectors().subscribe(data => {
      this.collectors.set(data);
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    const payload: CreateUpdateVehiclePayload = this.vehicleForm.value;
    this.vehicleService.createVehicle(payload).subscribe({
      next: () => {
        alert('Vehicle created and assigned successfully!');
        this.router.navigate(['/v-review']);
      },
      error: (err) => alert(`Error creating vehicle: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/v-review']);
  }
}
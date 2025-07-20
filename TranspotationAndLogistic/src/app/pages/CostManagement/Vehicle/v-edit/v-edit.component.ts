import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Import necessary services and models
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';
import { CreateUpdateVehiclePayload, VehicleResponse } from '../../../../models/Logistic and Transport/VehicleManagement.model';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-v-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './v-edit.component.html',
  styleUrls: ['./v-edit.component.scss']
})
export class VehicleEditComponent implements OnInit, OnChanges {
  // --- Injected Services ---
  private fb = inject(FormBuilder);
  private collectorService = inject(CollectorService);

  // --- Inputs & Outputs for Modal Behavior ---
  @Input({ required: true }) vehicle!: VehicleResponse;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ vehicleId: number, payload: CreateUpdateVehiclePayload }>();

  // --- Form & State Properties ---
  vehicleForm: FormGroup;
  collectors = signal<CollectorResponse[]>([]); // To populate the dropdown

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
    // Fetch all collectors for the dropdown when the component initializes
    this.collectorService.getAllCollectors().subscribe(allCollectors => {
      this.collectors.set(allCollectors);
    });
  }

  // Use ngOnChanges to populate the form when the vehicle data is passed in
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle'] && this.vehicle) {
      this.vehicleForm.patchValue(this.vehicle);
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid || !this.vehicle) return;

    const payload: CreateUpdateVehiclePayload = this.vehicleForm.value;
    // Emit the ID and payload for the parent component to handle
    this.save.emit({ vehicleId: this.vehicle.vehicleId, payload });
  }

  onCancel(): void {
    this.close.emit(); // Emit the close event
  }
}
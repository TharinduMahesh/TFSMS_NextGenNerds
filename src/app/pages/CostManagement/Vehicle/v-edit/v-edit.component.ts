import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// CollectorService is no longer needed here as the collector list isn't used
// import { CollectorService } from '../../../../Services/LogisticAndTransport/Collector.service';
import { CreateUpdateVehiclePayload, VehicleResponse } from '../../../../models/Logistic and Transport/VehicleManagement.model';
// CollectorResponse is also not needed
// import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-v-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './v-edit.component.html',
  styleUrls: ['./v-edit.component.scss']
})
export class VehicleEditComponent implements OnChanges { // OnInit is no longer needed
  private fb = inject(FormBuilder);

  @Input({ required: true }) vehicle!: VehicleResponse; 
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ vehicleId: number, payload: CreateUpdateVehiclePayload }>();

  vehicleForm: FormGroup;

  constructor() {
    this.vehicleForm = this.fb.group({
      // --- FIX #1: Add collectorId back as a disabled control ---
      // This makes the form's structure match the payload, which is a better practice.
      collectorId: [{value: null, disabled: true}], 
      
      licensePlate: ['', [Validators.required, Validators.maxLength(50)]],
      volume: [0, [Validators.required, Validators.min(0.1)]],
      model: ['', [Validators.maxLength(100)]],
      
      isClean: [false],
      hasGoodTires: [false],
      hasVentilation: [false],
      isPestFree: [false],
      hasValidDocs: [false],
      hasFireExtinguisher: [false]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle'] && this.vehicle) {
      // patchValue will correctly set all controls, including the disabled collectorId
      this.vehicleForm.patchValue(this.vehicle);
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
        // Form is invalid, so do nothing. The button should already be disabled.
        return;
    }
    
    // --- FIX #2: Use getRawValue() to include disabled controls in the payload ---
    // .value would omit collectorId because it's disabled.
    // .getRawValue() includes ALL controls, which is what we need here.
    const payload: CreateUpdateVehiclePayload = this.vehicleForm.getRawValue();

    this.save.emit({ vehicleId: this.vehicle.vehicleId, payload });
  }

  onCancel(): void {
    this.close.emit();
  }
}
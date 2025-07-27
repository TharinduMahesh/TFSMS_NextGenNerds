import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectorService } from '../../../../Services/LogisticAndTransport/Collector.service';
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
  private fb = inject(FormBuilder);
  private collectorService = inject(CollectorService);

  @Input({ required: true }) vehicle!: VehicleResponse; 
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ vehicleId: number, payload: CreateUpdateVehiclePayload }>();

  vehicleForm: FormGroup;
  collectors = signal<CollectorResponse[]>([]);

  constructor() {
    this.vehicleForm = this.fb.group({
      collectorId: [{value: null, disabled: true}],
      licensePlate: ['', [Validators.required, Validators.maxLength(50)]],
      volume: [0, [Validators.required, Validators.min(0.1)]],
      model: ['', [Validators.maxLength(100)]],
      conditionNotes: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.collectorService.getAllCollectors().subscribe(allCollectors => {
      this.collectors.set(allCollectors);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle'] && this.vehicle) {
      this.vehicleForm.patchValue(this.vehicle);
    }
  }


  onSubmit(): void {
  if (this.vehicleForm.invalid || !this.vehicle) return;
  const payload: CreateUpdateVehiclePayload = {
    ...this.vehicle, 
    ...this.vehicleForm.value 
  };

  this.save.emit({ vehicleId: this.vehicle.vehicleId, payload });
}

  onCancel(): void {
    this.close.emit();
  }
}
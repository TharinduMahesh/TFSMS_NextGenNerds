import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectorResponse, CreateUpdateCollectorPayload } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-c-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './c-edit.component.html',
  styleUrls: ['./c-edit.component.scss']
})
export class CollectorEditComponent implements OnChanges {
  // --- Injected Services ---
  private fb = inject(FormBuilder);

  // --- Inputs & Outputs for Modal Behavior ---
  @Input({ required: true }) collector!: CollectorResponse;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ collectorId: number, payload: CreateUpdateCollectorPayload }>();

  // --- Form Properties ---
  collectorForm: FormGroup;

  constructor() {
    this.collectorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      contactNumber: ['', [Validators.required, Validators.maxLength(10)]],
      ratePerKm: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  // Use ngOnChanges to populate the form when the input data is received
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collector'] && this.collector) {
      this.collectorForm.patchValue(this.collector);
    }
  }

  onSubmit(): void {
    if (this.collectorForm.invalid || !this.collector) return;

    const payload: CreateUpdateCollectorPayload = this.collectorForm.value;
    // Emit the ID and payload for the parent component to handle the API call
    this.save.emit({ collectorId: this.collector.collectorId, payload });
  }

  onCancel(): void {
    this.close.emit(); // Emit the close event
  }
}
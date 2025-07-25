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
  private fb = inject(FormBuilder);

  @Input({ required: true }) collector!: CollectorResponse;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ collectorId: number, payload: CreateUpdateCollectorPayload }>();

  collectorForm: FormGroup;

  constructor() {
    // --- UPDATED FormGroup to include all new fields ---
    this.collectorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      ratePerKm: [null, [Validators.required, Validators.min(0.01)]],
      
      // New fields from the expanded model
      collectorNIC: ['', Validators.required],
      collectorAddressLine1: ['', Validators.required],
      collectorAddressLine2: [''], 
      collectorCity: ['', Validators.required],
      collectorPostalCode: [''], 
      collectorGender: [null, Validators.required],
      collectorDOB: [null, Validators.required],
      collectorPhoneNum: ['', Validators.required],
      collectorEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collector'] && this.collector) {
      // patchValue will correctly populate the expanded form
      this.collectorForm.patchValue(this.collector);
    }
  }

  onSubmit(): void {
    if (this.collectorForm.invalid || !this.collector) {
      alert('Please fill out all required fields correctly.');
      this.collectorForm.markAllAsTouched();
      return;
    }

    // The form value will now contain all the new fields
    const payload: CreateUpdateCollectorPayload = this.collectorForm.value;
    
    this.save.emit({ collectorId: this.collector.collectorId, payload });
    this.close.emit(); // Close the modal on successful submission trigger
  }

  onCancel(): void {
    this.close.emit(); 
  }
}
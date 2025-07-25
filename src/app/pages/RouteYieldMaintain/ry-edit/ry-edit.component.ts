import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RyService } from '../../../services/LogisticAndTransport/RouteYieldMaintain.service';
import { YieldPayload, YieldResponse } from '../../../models/Logistic and Transport/RouteYeildMaintain.model';

@Component({
  selector: 'app-ry-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ry-edit.component.html',
  styleUrls: ['./ry-edit.component.scss']
})
export class RyEditComponent implements OnChanges {
  // --- Injected Services ---
  private fb = inject(FormBuilder);
  private ryService = inject(RyService);

  // --- Inputs & Outputs for Modal Behavior ---
  @Input({ required: true }) yieldData!: YieldResponse;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ yId: number, payload: YieldPayload }>();

  // --- Form Properties ---
  editForm: FormGroup;

  constructor() {
    this.editForm = this.fb.group({
      collected_Yield: ['', Validators.required],
      golden_Tips_Present: ['No', Validators.required]
    });
  }

  // Use ngOnChanges to populate the form whenever the input data changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['yieldData'] && this.yieldData) {
      this.editForm.patchValue({
        collected_Yield: this.yieldData.collected_Yield,
        golden_Tips_Present: this.yieldData.golden_Tips_Present.toString()
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.yieldData) return;

    const payload: YieldPayload = {
      rId: this.yieldData.rId, // Get rId from the input data
      ...this.editForm.value,
    };
    
    // Emit the ID and the payload for the parent to handle the update
    this.save.emit({ yId: this.yieldData.yId, payload });
  }

  onCancel(): void {
    this.close.emit(); // Simply emit the close event
  }
}
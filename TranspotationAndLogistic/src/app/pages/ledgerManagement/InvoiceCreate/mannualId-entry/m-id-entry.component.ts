import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manual-id-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './m-id-entry.component.html',
  styleUrls: ['./m-id-entry.component.scss']
})
export class ManualIdEntryComponent {
  // Emits the entered ID when the user clicks 'Find'
  @Output() find = new EventEmitter<number>();
  
  manualIdForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.manualIdForm = this.fb.group({
      stockId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submitId(): void {
    if (this.manualIdForm.valid) {
      this.find.emit(this.manualIdForm.value.stockId);
    }
  }
}
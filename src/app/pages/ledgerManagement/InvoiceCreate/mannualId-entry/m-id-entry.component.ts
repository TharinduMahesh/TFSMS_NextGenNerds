import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manual-id-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './m-id-entry.component.html',
  styleUrls: ['./m-id-entry.component.scss']
})
export class ManualIdEntryComponent {
  
  manualIdForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.manualIdForm = this.fb.group({
      stockId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submitId(event: Event): void {
    
    event.preventDefault();

    if (this.manualIdForm.invalid) {
      return;
    }

    const stockId = this.manualIdForm.value.stockId;
    
    // Navigate to invoice-create page with stockId as query parameter
    this.router.navigate(['ledgerManagementdashboard/invoice-create'], {
      queryParams: { stockId: stockId }
    });
  }

  // Add a simple click handler to test if the button is working at all
  testClick(): void {
    console.log('Test button clicked - basic click is working!');
  }
}
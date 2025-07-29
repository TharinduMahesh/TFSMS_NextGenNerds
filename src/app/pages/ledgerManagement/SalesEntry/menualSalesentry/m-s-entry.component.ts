import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manual-sales-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './m-s-entry.component.html',
  styleUrls: ['./m-s-entry.component.scss'] // You can reuse the same SCSS file
})
export class ManualSalesEntryComponent {
  
  manualIdForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.manualIdForm = this.fb.group({
      invoiceId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submitId(): void {
    if (this.manualIdForm.invalid) {
      return;
    }

    const invoiceId = this.manualIdForm.value.invoiceId;
    
    // This now navigates to the 'sales-entry' page with the correct query parameter
    this.router.navigate(['ledgerManagementdashboard/sales-entry'], {
      queryParams: { invoiceId: invoiceId }
    });
  }
}
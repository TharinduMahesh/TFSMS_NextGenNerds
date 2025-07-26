import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Import the correct model and service
import { CreatePackedTeaPayload } from '../../../models/Ledger Management/stockLedger.model';
import { StockLedgerService } from '../../../Services/LedgerManagement/stockLedger.service';

@Component({
  selector: 'app-tea-packing-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './t-p-entry.component.html',
  styleUrls: ['./t-p-entry.component.scss']
})

export class TeaPackingEntryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private stockLedgerService = inject(StockLedgerService);

  packingForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.packingForm = this.fb.group({
      grade: ['', Validators.required],
      gardenMark: ['', Validators.required],
      financialYear: [new Date().getFullYear(), Validators.required],
      packingType: ['Paper Sack', Validators.required],
      weightKg: [null, [Validators.required, Validators.min(0.01)]],
      packingDate: [this.formatDate(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {}

  private formatDate(date: Date): string {
    // Helper to format date as YYYY-MM-DD for the date input
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.packingForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    this.isSubmitting = true;
    const payload: CreatePackedTeaPayload = this.packingForm.value;

    this.stockLedgerService.createPackedTeaEntry(payload).subscribe({
      next: () => {
        alert('New tea batch successfully added to the stock ledger!');
        this.router.navigate(['/ledgerManagementdashboard/stock-ledger']); // Navigate to the stock ledger list after success
      },
      error: (err) => {
        alert(`Error: ${err.message}`);
        this.isSubmitting = false; // Re-enable the form on error
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['ledgerManagementdashboard/stock-ledger']); // Navigate back to a dashboard or home page
  }
}
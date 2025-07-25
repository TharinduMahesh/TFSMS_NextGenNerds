import { Component, OnInit, signal, inject, computed } from '@angular/core'; // Ensure 'computed' is imported
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

// Import necessary models and services
import { FinalizeSalePayload, InvoiceResponse } from '../../../models/Ledger Management/invoiceSales.model';
import { InvoiceSalesService } from '../../../services/LedgerManagement/invoiceSales.service';

@Component({
  selector: 'app-sales-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './s-entry.component.html',
  styleUrls: ['./s-entry.component.scss']
})
export class SalesEntryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceSalesService);

  salesForm: FormGroup;
  
  // Base signals for state management
  private invoiceToFinalize = signal<InvoiceResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // This new computed signal safely provides the invoice to the template
  invoice = computed(() => this.invoiceToFinalize());

  constructor() {
    this.salesForm = this.fb.group({
      invoiceId: [{value: null, disabled: true}, Validators.required],
      buyerName: ['', [Validators.required, Validators.maxLength(200)]],
      soldPricePerKg: [null, [Validators.required, Validators.min(0.01)]],
      salesCharges: this.fb.array([]) // A FormArray to dynamically add/remove charges
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const invoiceId = params.get('invoiceId');
        if (!invoiceId) {
          this.isLoading.set(false);
          this.error.set('No invoice selected. Please return to the invoice register and select an invoice to finalize.');
          throw new Error('Invoice ID is missing.');
        }
        return this.invoiceService.getInvoiceById(+invoiceId);
      })
    ).subscribe({
      next: (invoiceData) => {
        if (invoiceData.status !== 'Dispatched') {
             this.error.set(`This sale cannot be finalized. The invoice must have a 'Dispatched' status. Current status: ${invoiceData.status}.`);
             this.isLoading.set(false);
             return;
        }
        this.invoiceToFinalize.set(invoiceData);
        this.salesForm.patchValue({ invoiceId: invoiceData.invoiceId });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load invoice details.');
        this.isLoading.set(false);
      }
    });
  }
  
  get salesCharges(): FormArray {
    return this.salesForm.get('salesCharges') as FormArray;
  }

  addCharge(): void {
    const chargeFormGroup = this.fb.group({
      chargeType: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
    this.salesCharges.push(chargeFormGroup);
  }

  removeCharge(index: number): void {
    this.salesCharges.removeAt(index);
  }

  onSubmit(): void {
    if (this.salesForm.invalid) {
      alert('Please fill out all required fields, including any added charges.');
      return;
    }

    const payload: FinalizeSalePayload = this.salesForm.getRawValue();

    this.invoiceService.finalizeSale(payload).subscribe({
      next: () => {
        alert('Sale finalized and recorded successfully!');
        this.router.navigate(['ledgerManagementdashboard/invoice-review']); // Or your invoice list page
      },
      error: (err) => alert(`Error finalizing sale: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['ledgerManagementdashboard/invoice-review']); // Or your invoice list page
  }
}
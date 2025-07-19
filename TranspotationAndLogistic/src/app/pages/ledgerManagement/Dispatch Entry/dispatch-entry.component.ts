import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

// Models and Services
import { CreateDispatchPayload } from '../../../models/Ledger Management/dispatch.model';
import { InvoiceResponse } from '../../../models/Ledger Management/invoiceSales.model';
import { DispatchService } from '../../../services/LedgerManagement/dispatch.service';
import { InvoiceSalesService } from '../../../services/LedgerManagement/invoiceSales.service';

@Component({
  selector: 'app-dispatch-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dispatch-entry.component.html',
  styleUrls: ['./dispatch-entry.component.scss']
})
export class DispatchEntryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dispatchService = inject(DispatchService);
  private invoiceService = inject(InvoiceSalesService);

  dispatchForm: FormGroup;
  
  invoiceToDispatch = signal<InvoiceResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.dispatchForm = this.fb.group({
      invoiceId: [{value: null, disabled: true}, Validators.required],
      dispatchDate: [this.formatDate(new Date()), Validators.required],
      vehicleNumber: ['', [Validators.required, Validators.maxLength(50)]],
      driverName: ['', [Validators.required, Validators.maxLength(150)]],
      driverNic: [''],
      sealNumber: [''],
      bagCount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const invoiceId = params.get('invoiceId');
        if (!invoiceId) {
          this.isLoading.set(false);
          this.error.set('No invoice selected. Please return to the invoice register and select an invoice to dispatch.');
          throw new Error('Invoice ID is missing from query parameters.');
        }
        return this.invoiceService.getInvoiceById(+invoiceId);
      })
    ).subscribe({
      next: (invoiceData) => {
        if (invoiceData.status !== 'Pending') {
             this.error.set(`This invoice (Status: ${invoiceData.status}) cannot be dispatched. Only invoices with a 'Pending' status can be dispatched.`);
             this.isLoading.set(false);
             return;
        }
        this.invoiceToDispatch.set(invoiceData);
        this.dispatchForm.patchValue({ invoiceId: invoiceData.invoiceId });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load invoice details.');
        this.isLoading.set(false);
      }
    });
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.dispatchForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload: CreateDispatchPayload = this.dispatchForm.getRawValue();

    this.dispatchService.createDispatch(payload).subscribe({
      next: () => {
        alert('Dispatch recorded successfully!');
        this.router.navigate(['/in-review']);
      },
      error: (err) => alert(`Error recording dispatch: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/in-review']);
  }
}
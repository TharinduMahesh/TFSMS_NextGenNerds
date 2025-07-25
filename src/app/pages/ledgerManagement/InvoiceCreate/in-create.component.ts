import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { switchMap } from 'rxjs/operators';

// Import necessary models and services
import { CreateInvoicePayload } from '../../../models/Ledger Management/invoiceSales.model';
import { InvoiceSalesService } from '../../../services/LedgerManagement/invoiceSales.service';
import { StockLedgerResponse } from '../../../models/Ledger Management/stockLedger.model';
import { StockLedgerService } from '../../../services/LedgerManagement/stockLedger.service';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './in-create.component.html',
  styleUrls: ['./in-create.component.scss']
})
export class InvoiceCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // For reading URL params
  private invoiceService = inject(InvoiceSalesService);
  private stockLedgerService = inject(StockLedgerService);

  invoiceForm: FormGroup;
  
  // Signals for state management
  stockItemToInvoice = signal<StockLedgerResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.invoiceForm = this.fb.group({
      // We will get stockLedgerEntryId from the URL, but keep it in the form
      stockLedgerEntryId: [{value: null, disabled: true}, Validators.required],
      brokerName: ['', [Validators.required, Validators.maxLength(150)]],
      invoiceDate: [this.formatDate(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {
    // Read the 'stockId' from the URL query parameters
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const stockId = params.get('stockId');
        if (!stockId) {
          this.isLoading.set(false);
          this.error.set('No stock item selected. Please go back to the stock ledger and choose an item to invoice.');
          throw new Error('Stock ID is missing.');
        }
        // Fetch the details of the stock item to display them
        return this.stockLedgerService.getStockLedgerEntryById(+stockId);
      })
    ).subscribe({
      next: (stockData) => {
        if (stockData.status !== 'Unsold') {
             this.error.set(`This stock item (ID: ${stockData.stockLedgerEntryId}) cannot be invoiced. Its current status is '${stockData.status}'.`);
             this.isLoading.set(false);
             return;
        }
        this.stockItemToInvoice.set(stockData);
        // Pre-fill the form with the stock ID
        this.invoiceForm.patchValue({ stockLedgerEntryId: stockData.stockLedgerEntryId });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load stock item details.');
        this.isLoading.set(false);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    // Get the raw value, including the disabled stockId
    const payload: CreateInvoicePayload = this.invoiceForm.getRawValue();

    this.invoiceService.createInvoice(payload).subscribe({
      next: () => {
        alert('Invoice created successfully!');
        this.router.navigate(['/ledgerManagementdashboard/invoice-review']); // Navigate to the invoice list
      },
      error: (err) => alert(`Error creating invoice: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/ledgerManagementdashboard/stock-ledger']); // Navigate back to the stock ledger
  }
}
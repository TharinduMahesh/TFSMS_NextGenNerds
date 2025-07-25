import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

// Models and Services
import { CreateInvoicePayload } from '../../../models/Ledger Management/invoiceSales.model';
import { InvoiceSalesService } from '../../../services/LedgerManagement/invoiceSales.service';
import { StockLedgerResponse } from '../../../models/Ledger Management/stockLedger.model';
import { StockLedgerService } from '../../../services/LedgerManagement/stockLedger.service';
import { ManualIdEntryComponent } from './mannualId-entry/m-id-entry.component';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe , ManualIdEntryComponent],
  templateUrl: './in-create.component.html',
  styleUrls: ['./in-create.component.scss']
})
export class InvoiceCreateComponent implements OnInit {
  // --- Injections ---
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceSalesService);
  private stockLedgerService = inject(StockLedgerService);

  // --- Forms ---
  invoiceForm: FormGroup;
  manualIdForm: FormGroup; // For manual ID entry

  // --- State Signals ---

   public stockItem = computed(() => this.stockItemToInvoice());
   
  stockItemToInvoice = signal<StockLedgerResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isManualEntryMode = signal(false); 

  constructor() {
    this.invoiceForm = this.fb.group({
      stockLedgerEntryId: [{value: null, disabled: true}, Validators.required],
      brokerName: ['', [Validators.required, Validators.maxLength(150)]],
      invoiceDate: [this.formatDate(new Date()), Validators.required]
    });
    
    this.manualIdForm = this.fb.group({
      stockId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const stockIdFromUrl = this.route.snapshot.queryParamMap.get('stockId');

    if (stockIdFromUrl) {
      // If ID is in the URL, fetch data immediately
      this.isManualEntryMode.set(false);
      this.loadStockItem(+stockIdFromUrl);
    } else {
      // If no ID in URL, switch to manual entry mode
      this.isManualEntryMode.set(true);
      this.isLoading.set(false);
    }
  }

  loadStockItem(stockId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.stockLedgerService.getStockLedgerEntryById(stockId).subscribe({
      next: (stockData) => {
        if (stockData.status !== 'Unsold') {
             this.error.set(`Stock item #${stockId} is not available (Status: '${stockData.status}'). Only 'Unsold' items can be invoiced.`);
             this.isLoading.set(false);
             if (!this.isManualEntryMode()) this.stockItemToInvoice.set(null);
             return;
        }
        this.stockItemToInvoice.set(stockData);
        this.invoiceForm.patchValue({ stockLedgerEntryId: stockData.stockLedgerEntryId });
        this.isManualEntryMode.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(`Failed to load stock item #${stockId}. Please check the ID and try again.`);
        this.isLoading.set(false);
        if (!this.isManualEntryMode()) this.stockItemToInvoice.set(null);
      }
    });
  }
  
  findStockItem(): void {
    if (this.manualIdForm.invalid) return;
    const stockId = this.manualIdForm.value.stockId;
    this.loadStockItem(stockId);
  }
  toggleManualEntry(): void {
    this.isManualEntryMode.set(!this.isManualEntryMode());
    if (this.isManualEntryMode()) {
      this.stockItemToInvoice.set(null);
      this.invoiceForm.reset();
    } else {
      this.manualIdForm.reset();
    }
  }



  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }
    const payload: CreateInvoicePayload = this.invoiceForm.getRawValue();
    this.invoiceService.createInvoice(payload).subscribe({
      next: () => {
        alert('Invoice created successfully!');
        this.router.navigate(['ledgerManagementdashboard/invoice-review']); // Navigate to invoice review page
      },
      error: (err) => alert(`Error creating invoice: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['ledgerManagementdashboard/stock-ledger']); // Go back to the main stock ledger
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
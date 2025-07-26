import { Component, OnInit, signal, inject, computed, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Models and Services
import { CreateInvoicePayload } from '../../../models/Ledger Management/invoiceSales.model';
import { InvoiceSalesService } from '../../../Services/LedgerManagement/invoiceSales.service';
import { StockLedgerResponse } from '../../../models/Ledger Management/stockLedger.model';
import { StockLedgerService } from '../../../Services/LedgerManagement/stockLedger.service';
import { ManualIdEntryComponent } from "./mannualId-entry/m-id-entry.component";

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, ManualIdEntryComponent],
  templateUrl: './in-create.component.html',
  styleUrls: ['./in-create.component.scss']
})
export class InvoiceCreateComponent implements OnInit, OnDestroy {
  // --- Injections ---
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceSalesService);
  private stockLedgerService = inject(StockLedgerService);

  // --- Forms ---
  invoiceForm: FormGroup;

  // --- State Signals ---
  public stockItem = computed(() => this.stockItemToInvoice());
   
  stockItemToInvoice = signal<StockLedgerResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isManualEntryMode = signal(false);

  // --- Subscriptions ---
  private queryParamSubscription?: Subscription;
  

  constructor() {
    this.invoiceForm = this.fb.group({
      stockLedgerEntryId: [{value: null, disabled: true}, Validators.required],
      brokerName: ['', [Validators.required, Validators.maxLength(150)]],
      invoiceDate: [this.formatDate(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to query parameter changes to handle navigation from ManualIdEntryComponent
    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      const stockId = params['stockId'];
      
      if (stockId) {
        // If ID is in the URL, fetch data immediately
        this.isManualEntryMode.set(false);
        this.loadStockItem(+stockId);
      } else {
        // If no ID in URL, switch to manual entry mode
        this.isManualEntryMode.set(true);
        this.isLoading.set(false);
        this.stockItemToInvoice.set(null);
        this.error.set(null);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
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
             this.stockItemToInvoice.set(null);
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
        this.stockItemToInvoice.set(null);
      }
    });
  }

  toggleManualEntry(): void {
    // Clear query parameters and navigate to clean URL
    this.router.navigate(['ledgerManagementdashboard/invoice-create']);
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
        this.router.navigate(['ledgerManagementdashboard/invoice-review']);
      },
      error: (err) => alert(`Error creating invoice: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['ledgerManagementdashboard/stock-ledger']);
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
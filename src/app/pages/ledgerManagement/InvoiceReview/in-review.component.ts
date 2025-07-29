import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Removed unused CurrencyPipe/DatePipe for this component
import { Router } from '@angular/router';
import { InvoiceResponse } from '../../../models/Ledger Management/invoiceSales.model';
import { InvoiceSalesService } from '../../../Services/LedgerManagement/invoiceSales.service';
import { InvoiceViewComponent } from "./invoice-view/in-view.component";

@Component({
  selector: 'app-invoice-review',
  standalone: true,
  imports: [CommonModule, InvoiceViewComponent],
  templateUrl: './in-review.component.html',
  styleUrls: ['./in-review.component.scss']
})
export class InvoiceReviewComponent implements OnInit {
  private invoiceService = inject(InvoiceSalesService);
  private router = inject(Router);

  private allInvoices = signal<InvoiceResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');
  statusFilter = signal('All');

  filteredInvoices = computed(() => {
    const invoices = this.allInvoices();
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return invoices.filter(item => {
      // Use item.status, not item.Status
      const matchesStatus = (status === 'All') || (item.status === status);
      const matchesSearch = term === '' ||
        item.invoiceNumber.toLowerCase().includes(term) ||
        (item.brokerName && item.brokerName.toLowerCase().includes(term)) ||
        (item.gardenMark && item.gardenMark.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.allInvoices.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load invoices.');
        this.isLoading.set(false);
      }
    });
  }

  // Action to navigate to the dispatch entry page
  recordDispatchFor(invoice: InvoiceResponse): void {
    if (invoice.status !== 'Pending') {
      alert(`This invoice cannot be dispatched. Status: ${invoice.status}`);
      return;
    }
    // Corrected navigation path from the last time
    this.router.navigate(['/ledgerManagementdashboard/dispatch-entry'], { queryParams: { invoiceId: invoice.invoiceId } });
  }

  // Action to navigate to the sales finalization page
  finalizeSaleFor(invoice: InvoiceResponse): void {
    if (invoice.status !== 'Dispatched') {
      alert(`This invoice must be dispatched before the sale can be finalized. Status: ${invoice.status}`);
      return;
    }
    // The path here must also match your app.routes.ts
    this.router.navigate(['/ledgerManagementdashboard/sales-entry'], { queryParams: { invoiceId: invoice.invoiceId } });
  }


  // Add these properties
  isViewModalOpen = signal(false);
  invoiceToView = signal<InvoiceResponse | null>(null);

  // Add this new method
  viewDetails(invoice: InvoiceResponse): void {
    this.invoiceToView.set(invoice);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
  }
}
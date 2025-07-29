// src/app/components/Ledger_Management/Invoice_Register/invoice-register.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation

import { InvoiceService } from '../../../Services/invoice.service'; // Import Invoice Service
import { Invoice } from '../../../models/invoice.interface'; // Import Invoice interface

@Component({
  selector: 'app-invoice-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-register.component.html',
  styleUrls: ['./invoice-register.component.css']
})
export class InvoiceRegisterComponent implements OnInit {

  // --- Filter Properties ---
  invoiceNumberFilter: string = '';
  brokerNameFilter: string = '';
  statusFilter: string = ''; // Filter by combined status
  startDateFilter: string = '2023-01-01'; // Default to a wide historical range
  endDateFilter: string = new Date().toISOString().split('T')[0]; // Default to today's date

  // Predefined options for status filter
  invoiceStatuses: string[] = ['Pending', 'Invoiced', 'Dispatched', 'Paid']; // Matches Invoice.Status

  // --- Data Table Properties ---
  allInvoiceRecords: Invoice[] = []; // Stores all fetched invoices
  filteredInvoiceRecords: Invoice[] = []; // Stores invoices after applying filters

  public isBrowser: boolean;

  constructor(
    private router: Router,
    private invoiceService: InvoiceService, // Inject the Invoice Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadInvoiceRecords();
  }

  /**
   * @method loadInvoiceRecords
   * @description Fetches invoice records from the backend.
   */
  loadInvoiceRecords(): void {
    // Pass filters to the service call
    this.invoiceService.getInvoices(
      this.statusFilter,
      this.invoiceNumberFilter,
      this.startDateFilter,
      this.endDateFilter
    ).subscribe({
      next: (data) => {
        this.allInvoiceRecords = data.map(entry => ({
          ...entry,
          invoiceDate: entry.invoiceDate ? new Date(entry.invoiceDate).toISOString().split('T')[0] : '', // Ensure YYYY-MM-DD
        })).sort((a, b) => (b.invoiceId || 0) - (a.invoiceId || 0)); // Sort by ID descending

        console.log('Invoice records loaded:', this.allInvoiceRecords);
        this.applyFilters(); // Apply client-side filters if any, or just display
      },
      error: (error) => {
        console.error('Error loading invoice records:', error);
        if (this.isBrowser) {
          alert('Failed to load invoice records. Please try again.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies client-side filters (if any beyond backend filters) to the invoice data.
   * Updates `filteredInvoiceRecords`.
   */
  applyFilters(): void {
    let tempRecords = [...this.allInvoiceRecords];

    // Client-side filtering (if needed on top of backend filters)
    if (this.brokerNameFilter) {
      tempRecords = tempRecords.filter(record =>
        record.brokerName.toLowerCase().includes(this.brokerNameFilter.toLowerCase())
      );
    }

    this.filteredInvoiceRecords = tempRecords;
  }

  /**
   * @method clearFilters
   * @description Resets all filters to their default values and reloads the report.
   */
  clearFilters(): void {
    this.invoiceNumberFilter = '';
    this.brokerNameFilter = '';
    this.statusFilter = '';
    this.startDateFilter = '2023-01-01';
    this.endDateFilter = new Date().toISOString().split('T')[0];
    this.loadInvoiceRecords(); // Reload data with cleared filters
  }

  /**
   * @method navigateToDispatchCreation
   * @description Navigates to the dispatch creation page for a specific invoice.
   * @param invoiceId The ID of the invoice to dispatch.
   */
  navigateToDispatchCreation(invoiceId: number | undefined): void {
    if (invoiceId === undefined) {
      if (this.isBrowser) {
        alert('Cannot assign dispatch: Invoice ID is missing.');
      }
      return;
    }
    this.router.navigate(['/ledger-management/dispatch-details'], { queryParams: { invoiceId: invoiceId } });
  }

  /**
   * @method navigateToFinalizeSale
   * @description Navigates to the finalize sale page for a specific invoice.
   * @param invoiceId The ID of the invoice to finalize.
   */
  navigateToFinalizeSale(invoiceId: number | undefined): void {
    if (invoiceId === undefined) {
      if (this.isBrowser) {
        alert('Cannot finalize sale: Invoice ID is missing.');
      }
      return;
    }
    this.router.navigate(['/ledger-management/finalize-sale'], { queryParams: { invoiceId: invoiceId } });
  }

  /**
   * @method viewInvoiceDetails
   * @description Navigates to a detailed view of a specific invoice.
   * @param invoiceId The ID of the invoice to view.
   */
  viewInvoiceDetails(invoiceId: number | undefined): void {
    if (invoiceId === undefined) {
      if (this.isBrowser) {
        alert('Cannot view details: Invoice ID is missing.');
      }
      return;
    }
    // Assuming you'll have an Invoice Details Component/Page
    this.router.navigate(['/ledger-management/invoice-details'], { queryParams: { invoiceId: invoiceId } });
  }

  /**
   * @method formatDate
   * @description Utility function to format date strings for display.
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(); // For display
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  /**
   * @method exitPage
   * @description Navigates the user back to the ledger management homepage.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

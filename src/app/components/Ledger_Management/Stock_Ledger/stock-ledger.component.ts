// src/app/components/Ledger_Management/Stock_Ledger/stock-ledger.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation

import { StockLedgerEntryService } from '../../../Services/stock-ledger-entry.service'; // Import the new service
import { StockLedgerEntry } from '../../../models/stock-ledger-entry.interface'; // Import the StockLedgerEntry interface

@Component({
  selector: 'app-stock-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-ledger.component.html',
  styleUrls: ['./stock-ledger.component.css']
})
export class StockLedgerComponent implements OnInit {

  // --- Filter Properties ---
  statusFilter: string = '';
  gradeFilter: string = '';
  gardenMarkFilter: string = '';

  // --- Data Table Properties ---
  allStockLedgerRecords: StockLedgerEntry[] = []; // Stores all fetched records
  filteredStockLedgerRecords: StockLedgerEntry[] = []; // Stores records after applying filters

  // Predefined options for status filter
  stockStatuses: string[] = ['Unsold', 'Invoiced', 'Sold'];

  public isBrowser: boolean; // To check if running in browser environment

  constructor(
    private router: Router,
    private stockLedgerService: StockLedgerEntryService, // Inject the StockLedgerEntry Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadStockLedgerRecords();
  }

  /**
   * @method loadStockLedgerRecords
   * @description Fetches stock ledger entries data from the backend.
   */
  loadStockLedgerRecords(): void {
    // Pass filters to the service call
    this.stockLedgerService.getStockLedgerEntries(this.statusFilter, this.gradeFilter, this.gardenMarkFilter).subscribe({
      next: (data) => {
        this.allStockLedgerRecords = data.map(entry => ({
          ...entry,
          // Ensure nested dates are formatted if needed for display
          packedTea: entry.packedTea ? {
            ...entry.packedTea,
            packingDate: new Date(entry.packedTea.packingDate).toISOString().split('T')[0]
          } : undefined,
          invoice: entry.invoice ? {
            ...entry.invoice,
            invoiceDate: new Date(entry.invoice.invoiceDate).toISOString().split('T')[0]
          } : undefined,
        })).sort((a, b) => (b.stockLedgerEntryId || 0) - (a.stockLedgerEntryId || 0)); // Sort by ID descending

        console.log('Stock Ledger records loaded:', this.allStockLedgerRecords);
        this.applyFilters(); // Apply filters (which might just be displaying all loaded data initially)
      },
      error: (error) => {
        console.error('Error loading stock ledger records:', error);
        if (this.isBrowser) {
          alert('Failed to load stock ledger records. Please try again.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies client-side filters to the stock ledger data.
   * Updates `filteredStockLedgerRecords`.
   */
  applyFilters(): void {
    // Since filters are passed to the backend, this method primarily updates the display
    // if client-side filtering is also desired on top of backend filtering.
    // For now, it just ensures the data is displayed after load.
    this.filteredStockLedgerRecords = [...this.allStockLedgerRecords];
  }

  /**
   * @method clearFilters
   * @description Resets all filters to their default values and reloads the report.
   */
  clearFilters(): void {
    this.statusFilter = '';
    this.gradeFilter = '';
    this.gardenMarkFilter = '';
    this.loadStockLedgerRecords(); // Reload data with cleared filters
  }

  /**
   * @method navigateToInvoiceCreation
   * @description Navigates to the invoice creation page, passing the StockLedgerEntryId.
   * @param stockLedgerEntryId The ID of the StockLedgerEntry to invoice.
   */
  navigateToInvoiceCreation(stockLedgerEntryId: number | undefined): void {
    if (stockLedgerEntryId === undefined) {
      if (this.isBrowser) {
        alert('Cannot create invoice: Stock Ledger Entry ID is missing.');
      }
      return;
    }
    // Navigate to the Invoice Creation page, passing the StockLedgerEntryId as a query parameter or route parameter
    this.router.navigate(['/ledger-management/invoice-creation'], { queryParams: { stockId: stockLedgerEntryId } });
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

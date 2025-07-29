import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // Import needed pipes
import { Router } from '@angular/router';

// Import the correct model and service
import { StockLedgerResponse } from '../../../models/Ledger Management/stockLedger.model';
import { StockLedgerService } from '../../../Services/LedgerManagement/stockLedger.service';

@Component({
  selector: 'app-stock-ledger-view',
  standalone: true,
  imports: [CommonModule, DatePipe], // Add pipes to imports array
  templateUrl: './s-t-view.component.html',
  styleUrls: ['./s-t-view.component.scss']
})
export class StockLedgerViewComponent implements OnInit {
  private stockLedgerService = inject(StockLedgerService);
  private router = inject(Router);

  // --- State Signals ---
  private allStock = signal<StockLedgerResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // --- Filter Signals ---
  searchTerm = signal('');
  statusFilter = signal('All'); // e.g., 'All', 'Unsold', 'Invoiced'

  // --- Computed Signal for Displaying Filtered Data ---
  filteredStock = computed(() => {
    const stock = this.allStock();
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return stock.filter(item => {
      const matchesStatus = (status === 'All') || (item.status === status);
      
      const matchesSearch = term === '' ||
        item.grade.toLowerCase().includes(term) ||
        item.gardenMark.toLowerCase().includes(term) ||
        item.stockLedgerEntryId.toString().includes(term);

      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.fetchStockLedger();
  }

  fetchStockLedger(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.stockLedgerService.getAllStockLedgerEntries().subscribe({
      next: (data) => {
        this.allStock.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load stock ledger.');
        this.isLoading.set(false);
      }
    });
  }
  
  goToPackingEntry(): void {
    this.router.navigate(['/ledgerManagementdashboard/tea-packing']);
  }
  
  // Placeholder for when you build the invoice create page
  createInvoiceFor(stockItem: StockLedgerResponse): void {
    if (stockItem.status !== 'Unsold') {
      alert('This item is not available for invoicing. Its status is: ' + stockItem.status);
      return;
    }
    // We pass the stock ID to the invoice creation page
    this.router.navigate(['/ledgerManagementdashboard/invoice-create'], { queryParams: { stockId: stockItem.stockLedgerEntryId } });
    console.log(`Navigating to create invoice for Stock ID: ${stockItem.stockLedgerEntryId}`);
  }
}
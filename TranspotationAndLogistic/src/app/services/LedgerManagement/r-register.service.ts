import { Injectable, signal, computed } from '@angular/core';
import { ReturnRegisterRecord, ReturnRegisterFilter } from '../../models/Ledger Management/r-register.model';

@Injectable({
  providedIn: 'root'
})
export class ReturnRegisterService {
  // --- State ---
  private allRecords = signal<ReturnRegisterRecord[]>([]);
  private activeFilters = signal<ReturnRegisterFilter>({
    date: '',
    season: '',
    reason: '',
    invoice: ''
  });

  // --- Computed Data ---
  // This signal reactively filters the data whenever the activeFilters signal changes.
  public filteredRecords = computed(() => {
    const records = this.allRecords();
    const filters = this.activeFilters();
    
    // If no filters are active, show all records.
    if (!filters.date && !filters.season && !filters.reason && !filters.invoice) {
      return records;
    }

    return records.filter(record => {
      const dateMatch = !filters.date || record.returnDate === filters.date;
      const seasonMatch = !filters.season || record.season.toLowerCase().includes(filters.season.toLowerCase());
      const reasonMatch = !filters.reason || record.reason.toLowerCase().includes(filters.reason.toLowerCase());
      const invoiceMatch = !filters.invoice || record.invoice.toLowerCase().includes(filters.invoice.toLowerCase());
      
      return dateMatch && seasonMatch && reasonMatch && invoiceMatch;
    });
  });

  constructor() {
    this.loadInitialData();
  }

  // Updates the filters, which automatically triggers the computed signal to update.
  public applyFilters(filters: ReturnRegisterFilter): void {
    this.activeFilters.set(filters);
  }

  // In a real app, this data would come from an API.
  private loadInitialData(): void {
    const mockData: ReturnRegisterRecord[] = [
      { id: 1, returnDate: '2024-12-01', season: 'Winter', reason: 'Damaged', invoice: 'INV001', kilosReturned: 50, remarks: 'Damaged during transport' },
      { id: 2, returnDate: '2024-12-15', season: 'Autumn', reason: 'Quality Issue', invoice: 'INV002', kilosReturned: 30, remarks: 'Low quality' },
      { id: 3, returnDate: '2024-12-20', season: 'Winter', reason: 'Quantity Mismatch', invoice: 'INV003', kilosReturned: 20, remarks: 'Less quantity delivered' }
    ];
    this.allRecords.set(mockData);
  }
}
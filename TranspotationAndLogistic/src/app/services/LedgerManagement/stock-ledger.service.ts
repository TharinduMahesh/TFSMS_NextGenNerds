import { Injectable, signal, computed } from '@angular/core';
import { StockLedgerRecord, StockLedgerFilter } from '../../models/stock-ledger.model';

@Injectable({
  providedIn: 'root'
})
export class StockLedgerService {
  // --- State ---
  private allRecords = signal<StockLedgerRecord[]>([]);
  private activeFilters = signal<StockLedgerFilter>({
    grade: '',
    gardenMark: '',
    financialYear: '',
    packingType: ''
  });

  // --- Computed Data ---
  public filteredRecords = computed(() => {
    const records = this.allRecords();
    const filters = this.activeFilters();

    // If no filters are active, return an empty array or all records.
    // Let's return empty initially until the user clicks "Filter".
    // For this example, we will filter live.
    if (!filters.grade && !filters.gardenMark && !filters.financialYear && !filters.packingType) {
      return records; // Show all records if no filters are set
    }
    
    return records.filter(record => {
      const gradeMatch = !filters.grade || record.grade.toLowerCase().includes(filters.grade.toLowerCase());
      const gardenMarkMatch = !filters.gardenMark || record.gardenMark.toLowerCase().includes(filters.gardenMark.toLowerCase());
      const financialYearMatch = !filters.financialYear || record.financialYear.includes(filters.financialYear);
      const packingTypeMatch = !filters.packingType || record.packingType === filters.packingType;
      
      return gradeMatch && gardenMarkMatch && financialYearMatch && packingTypeMatch;
    });
  });

  constructor() {
    this.loadInitialData();
  }

  // Updates the filters, triggering the computed signal to re-evaluate.
  public updateFilters(filters: StockLedgerFilter): void {
    this.activeFilters.set(filters);
  }

  // Populates the service with mock data.
  private loadInitialData(): void {
    const mockData: StockLedgerRecord[] = [
      { id: 1, date: '2024-05-20', grade: 'BOP', gardenMark: 'Evergreen', financialYear: '2024-2025', packingType: 'bulk', quantityIn: 500, quantityOut: 0, remarks: 'Received' },
      { id: 2, date: '2024-05-21', grade: 'FBOP', gardenMark: 'Sunleaf', financialYear: '2024-2025', packingType: 'retail', quantityIn: 0, quantityOut: 150, remarks: 'Sold to RetailCo' },
      { id: 3, date: '2024-05-22', grade: 'BOP', gardenMark: 'Evergreen', financialYear: '2024-2025', packingType: 'bulk', quantityIn: 0, quantityOut: 200, remarks: 'Sold to Wholesale Inc' }
    ];
    this.allRecords.set(mockData);
  }
}
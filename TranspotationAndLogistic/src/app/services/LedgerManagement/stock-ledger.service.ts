import { Injectable, signal, computed } from '@angular/core';
import { StockLedger, StockLedgerFilter } from '../../models/stock-ledger.model';

@Injectable({
  providedIn: 'root'
})
export class StockLedgerService {
  private stockRecords = signal<StockLedger[]>([
    {
      id: '1',
      date: '2024-12-20',
      grade: 'A',
      gardenMark: 'Mark1',
      financialYear: '2024',
      packingType: 'bulk',
      quantityIn: 500,
      quantityOut: 200,
      remarks: 'Initial Stock'
    },
    {
      id: '2',
      date: '2024-12-21',
      grade: 'B',
      gardenMark: 'Mark2',
      financialYear: '2024',
      packingType: 'retail',
      quantityIn: 300,
      quantityOut: 100,
      remarks: 'New Shipment'
    }
  ]);

  private filters = signal<StockLedgerFilter>({
    grade: '',
    gardenMark: '',
    financialYear: '',
    packingType: ''
  });

  // Expose as readonly signals
  readonly records = this.stockRecords.asReadonly();
  readonly currentFilters = this.filters.asReadonly();

  // Computed filtered records
  readonly filteredRecords = computed(() => {
    const records = this.stockRecords();
    const filter = this.filters();

    return records.filter(record => {
      return (!filter.grade || record.grade.toLowerCase().includes(filter.grade.toLowerCase())) &&
             (!filter.gardenMark || record.gardenMark.toLowerCase().includes(filter.gardenMark.toLowerCase())) &&
             (!filter.financialYear || record.financialYear.includes(filter.financialYear)) &&
             (!filter.packingType || record.packingType === filter.packingType);
    });
  });

  addRecord(record: StockLedger): void {
    const newRecord = {
      ...record,
      id: this.generateId()
    };
    this.stockRecords.update(records => [...records, newRecord]);
  }

  removeRecord(id: string): void {
    this.stockRecords.update(records => 
      records.filter(record => record.id !== id)
    );
  }

  updateFilters(filters: Partial<StockLedgerFilter>): void {
    this.filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this.filters.set({
      grade: '',
      gardenMark: '',
      financialYear: '',
      packingType: ''
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
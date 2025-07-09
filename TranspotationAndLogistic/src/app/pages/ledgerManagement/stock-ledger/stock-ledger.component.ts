import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockLedgerService } from '../../../services/LedgerManagement/stock-ledger.service';
import { STOCK_PACKING_TYPES } from '../../../models/stock-ledger.model';

@Component({
  selector: 'app-stock-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-ledger.component.html',
  styleUrls: ['./stock-ledger.component.scss']
})
export class StockLedgerComponent {
  private stockService = inject(StockLedgerService);

  // Filter form signals
  gradeFilter = signal('');
  gardenMarkFilter = signal('');
  financialYearFilter = signal('');
  packingTypeFilter = signal('');

  // Data
  packingTypes = STOCK_PACKING_TYPES; 
  filteredRecords = this.stockService.filteredRecords;

  onGradeFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gradeFilter.set(target.value);
  }

  onGardenMarkFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gardenMarkFilter.set(target.value);
  }

  onFinancialYearFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.financialYearFilter.set(target.value);
  }

  onPackingTypeFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.packingTypeFilter.set(target.value);
  }

  onFilter(): void {
    this.updateFilters();
    console.log('Filtering records...');
  }

  onExit(): void {
    // Navigate back or close the component
    console.log('Exit clicked');
  }

  private updateFilters(): void {
    this.stockService.updateFilters({
      grade: this.gradeFilter(),
      gardenMark: this.gardenMarkFilter(),
      financialYear: this.financialYearFilter(),
      packingType: this.packingTypeFilter()
    });
  }
}
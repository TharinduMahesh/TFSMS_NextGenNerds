import { Component, signal, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockLedgerService } from '../../../services/LedgerManagement/stock-ledger.service';
import { StockLedgerRecord } from '../../../models/stock-ledger.model';

@Component({
  selector: 'app-stock-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
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

  // The constant is now defined directly in the component.
  packingTypes = [
    { value: 'bulk', label: 'Bulk' },
    { value: 'retail', label: 'Retail' },
    { value: 'loose', label: 'Loose Tea' },
    { value: 'bags', label: 'Tea Bags' },
    { value: 'boxes', label: 'Tea Boxes' },
    { value: 'pouches', label: 'Tea Pouches' }
  ];
  
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
  }

  onExit(): void {
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
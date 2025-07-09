import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeaPackingService } from '../../../services/LedgerManagement/tea-packing.service';
import { TeaPacking, PACKING_TYPES, PackingType } from '../../../models/tea-packing.model';

@Component({
  selector: 'app-tea-packing',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule is needed for [(ngModel)]
  templateUrl: './tea-packing.component.html',
  styleUrls: ['./tea-packing.component.scss']
})
export class TeaPackingComponent {
  private teaService = inject(TeaPackingService);
  
  // Form data signals - ngModel can write to these directly
  grade = signal('');
  gardenMark = signal('');
  financialYear = signal('');
  packingType = signal('');
  quantity = signal<number | null>(null);
  
  // Form validation signals (no changes needed here)
  gradeError = computed(() => {
    const value = this.grade();
    if (!value) return 'Grade is required';
    if (value.length < 2) return 'Grade must be at least 2 characters';
    return '';
  });
  
  gardenMarkError = computed(() => {
    const value = this.gardenMark();
    if (!value) return 'Garden Mark is required';
    if (value.length < 2) return 'Garden Mark must be at least 2 characters';
    return '';
  });
  
  financialYearError = computed(() => {
    const value = this.financialYear();
    if (!value) return 'Financial Year is required';
    if (!/^\d{4}-\d{2}$/.test(value)) return 'Format should be YYYY-YY (e.g., 2024-25)';
    return '';
  });
  
  packingTypeError = computed(() => {
    return !this.packingType() ? 'Packing Type is required' : '';
  });
  
  quantityError = computed(() => {
    const value = this.quantity();
    if (value === null || value === undefined) return 'Quantity is required';
    if (value <= 0) return 'Quantity must be greater than 0';
    return '';
  });
  
  isFormValid = computed(() => {
    return !this.gradeError() && 
           !this.gardenMarkError() && 
           !this.financialYearError() && 
           !this.packingTypeError() && 
           !this.quantityError();
  });
  
  // Data
  packingTypes: PackingType[] = PACKING_TYPES;
  records = this.teaService.records;
  
  onSubmit(): void {
    if (this.isFormValid()) {
      const record: TeaPacking = {
        grade: this.grade(),
        gardenMark: this.gardenMark(),
        financialYear: this.financialYear(),
        packingType: this.packingType(),
        quantity: this.quantity()!
      };
      
      this.teaService.addRecord(record);
      this.clearForm();
    }
  }
  
  clearForm(): void {
    this.grade.set('');
    this.gardenMark.set('');
    this.financialYear.set('');
    this.packingType.set('');
    this.quantity.set(null);
  }
  
  removeRecord(id: string): void {
    this.teaService.removeRecord(id);
  }

  // The on...Change methods are no longer needed!
}
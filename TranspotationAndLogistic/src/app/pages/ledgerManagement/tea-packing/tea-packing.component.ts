import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeaPackingService } from '../../../services/LedgerManagement/tea-packing.service';
import { TeaPacking, PACKING_TYPES, PackingType } from '../../../models/LedgerManagement/tea-packing.model';

@Component({
  selector: 'app-tea-packing',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './tea-packing.component.html',
  styleUrls: ['./tea-packing.component.scss']
})
export class TeaPackingComponent {
  private teaService = inject(TeaPackingService);

  grade = signal('');
  gardenMark = signal('');
  financialYear = signal('');
  date = signal('');
  packingType = signal('');
  quantity = signal<number | null>(null);
  remark = signal('');
  
  // Form validation signals
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

  dateError = computed(() => { // New validation for Date
    return !this.date() ? 'Date is required' : '';
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

  remarkError = computed(() => { // New validation for Remark (optional, length check)
    const value = this.remark();
    if (value.length > 200) return 'Remark cannot exceed 200 characters.';
    return '';
  });
  
  isFormValid = computed(() => {
    return !this.gradeError() && 
           !this.gardenMarkError() && 
           !this.financialYearError() && 
           !this.dateError() && // Added to validation check
           !this.packingTypeError() && 
           !this.quantityError() &&
           !this.remarkError(); // Added to validation check
  });
  
  // Data
  packingTypes: PackingType[] = PACKING_TYPES;
  records = this.teaService.records;
  
  onSubmit(): void {
    if (this.isFormValid()) {
      // Assumes TeaPacking model now includes date and remark
      const record: TeaPacking = {
        grade: this.grade(),
        gardenMark: this.gardenMark(),
        financialYear: this.financialYear(),
        date: this.date(), // Add date to record
        packingType: this.packingType(),
        quantity: this.quantity()!,
        remark: this.remark() // Add remark to record
      };
      
      this.teaService.addRecord(record);
      this.clearForm();
    }
  }
  
  clearForm(): void {
    this.grade.set('');
    this.gardenMark.set('');
    this.financialYear.set('');
    this.date.set(''); // Clear date
    this.packingType.set('');
    this.quantity.set(null);
    this.remark.set(''); // Clear remark
  }
  
  removeRecord(id: string): void {
    this.teaService.removeRecord(id);
  }
}
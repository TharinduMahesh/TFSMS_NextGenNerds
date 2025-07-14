// src/app/components/sales-entry/sales-entry.component.ts

import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesEntryService } from '../../../services/LedgerManagement/sales-entry.service';
import { Sale } from '../../../models/LedgerManagement/sales-entry.model';

@Component({
  selector: 'app-sales-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-entry.component.html',
  styleUrls: ['./sales-entry.component.scss']
})
export class SalesEntryComponent {
  private salesService = inject(SalesEntryService);
  private location = inject(Location);

  // Form Data Signals bound to input fields
  salesDate = signal('');
  buyerName = signal('');
  teaGrade = signal('');
  discount = signal<number | null>(null);
  remarks = signal('');
  kilosSold = signal<number | null>(null);

  // Real-time Validation Signals
  salesDateError = computed(() => !this.salesDate() ? 'Sales Date is required' : '');
  buyerNameError = computed(() => !this.buyerName() ? 'Buyer Name is required' : '');
  teaGradeError = computed(() => !this.teaGrade() ? 'Tea Grade is required' : '');
  
  discountError = computed(() => {
    const value = this.discount();
    if (value === null || value === undefined) return 'Discount is required';
    if (value < 0) return 'Discount cannot be negative';
    return '';
  });

  kilosSoldError = computed(() => {
    const value = this.kilosSold();
    if (value === null || value === undefined) return 'Kilos Sold is required';
    if (value <= 0) return 'Kilos must be greater than 0';
    return '';
  });

  // Computed signal to check overall form validity
  isFormValid = computed(() => 
    !this.salesDateError() && !this.buyerNameError() && !this.teaGradeError() &&
    !this.discountError() && !this.kilosSoldError()
  );

  // The records to display in the table, taken directly from the service's signal
  records = this.salesService.sales;

  /**
   * Handles form submission. Validates the form and adds the record if valid.
   */
  onSubmit(): void {
    if (this.isFormValid()) {
      const newRecord: Omit<Sale, 'id'> = {
        salesDate: this.salesDate(),
        buyerName: this.buyerName(),
        teaGrade: this.teaGrade(),
        discount: this.discount()!,
        remarks: this.remarks(),
        kilosSold: this.kilosSold()!
      };
      this.salesService.addSale(newRecord);
      this.clearForm();
    }
  }

  /**
   * Resets all form fields to their initial empty state.
   */
  clearForm(): void {
    this.salesDate.set('');
    this.buyerName.set('');
    this.teaGrade.set('');
    this.discount.set(null);
    this.remarks.set('');
    this.kilosSold.set(null);
  }

  /**
   * Navigates to the previous page.
   */
  onExit(): void {
    this.location.back();
  }
}
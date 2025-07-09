import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenaturedTeaService } from '../../../services/LedgerManagement/denatured-t-entry.service';

@Component({
  selector: 'app-denatured-tea-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './denatured-t-entry.component.html',
  styleUrls: ['./denatured-t-entry.component.scss']
})
export class DenaturedTeaEntryComponent {
  private teaService = inject(DenaturedTeaService);

  // --- Form Field Signals ---
  teaGrade = signal('');
  quantity = signal<number | null>(null);
  reason = signal('');

  // --- "Touched" State Signals for Onward Validation ---
  touched = {
    teaGrade: signal(false),
    quantity: signal(false),
    reason: signal(false),
  };

  // --- Computed Error Signals for Each Field ---
  teaGradeError = computed(() => this.touched.teaGrade() && !this.teaGrade() ? 'Tea Grade is required' : '');
  reasonError = computed(() => this.touched.reason() && !this.reason() ? 'Reason is required' : '');
  quantityError = computed(() => {
    if (!this.touched.quantity()) return ''; // Only show error if touched
    if (this.quantity() === null || this.quantity() === undefined) return 'Quantity is required';
    if (this.quantity()! <= 0) return 'Quantity must be greater than 0';
    return '';
  });

  // --- Overall Form Validity for Button State ---
  isFormValid = computed(() => 
    this.teaGrade().trim() !== '' &&
    this.reason().trim() !== '' &&
    this.quantity() != null && this.quantity()! > 0
  );

  // --- Data from Service ---
  records = this.teaService.records;

  // --- Component Methods ---

  addEntry(): void {
    // Mark all fields as touched to show all errors on a premature submit.
    Object.values(this.touched).forEach(state => state.set(true));

    if (!this.isFormValid()) {
      return;
    }
    
    this.teaService.addRecord({
      teaGrade: this.teaGrade(),
      quantity: this.quantity()!,
      reason: this.reason()
    });

    this.clearForm();
  }

  clearForm(): void {
    this.teaGrade.set('');
    this.quantity.set(null);
    this.reason.set('');

    // Reset touched states so validation errors disappear.
    Object.values(this.touched).forEach(state => state.set(false));
  }

  onExit(): void {
    console.log('Exit action triggered.');
  }
}
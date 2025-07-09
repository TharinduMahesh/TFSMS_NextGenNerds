import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeaReturnService } from '../../../services/LedgerManagement/t-return-entry.service';

@Component({
  selector: 'app-tea-return-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './t-return-entry.component.html',
  styleUrls: ['./t-return-entry.component.scss']
})
export class TeaReturnEntryComponent {
  private returnService = inject(TeaReturnService);

  // --- Form Field Signals ---
  season = signal('');
  reason = signal('');
  gardenMark = signal('');
  invoiceNumber = signal('');
  kilosReturned = signal<number | null>(null);
  returnDate = signal('');

  // --- "Touched" State Signals for Validation ---
  // These track if the user has interacted with a field (i.e., blur event).
  touched = {
    season: signal(false),
    reason: signal(false),
    gardenMark: signal(false),
    invoiceNumber: signal(false),
    kilosReturned: signal(false),
    returnDate: signal(false),
  };

  // --- Computed Validation Error Signals for Each Field ---
  seasonError = computed(() => this.touched.season() && !this.season() ? 'Season is required' : '');
  reasonError = computed(() => this.touched.reason() && !this.reason() ? 'Reason is required' : '');
  gardenMarkError = computed(() => this.touched.gardenMark() && !this.gardenMark() ? 'Garden Mark is required' : '');
  invoiceNumberError = computed(() => this.touched.invoiceNumber() && !this.invoiceNumber() ? 'Invoice Number is required' : '');
  returnDateError = computed(() => this.touched.returnDate() && !this.returnDate() ? 'Return Date is required' : '');
  kilosReturnedError = computed(() => {
    if (!this.touched.kilosReturned()) return '';
    if (this.kilosReturned() === null || this.kilosReturned() === undefined) return 'Kilos Returned is required';
    if (this.kilosReturned()! <= 0) return 'Value must be greater than 0';
    return '';
  });

  // --- Overall Form Validity ---
  isFormValid = computed(() => {
    // Check if the form is valid without needing to touch the fields first.
    return this.season().trim() !== '' &&
           this.reason().trim() !== '' &&
           this.gardenMark().trim() !== '' &&
           this.invoiceNumber().trim() !== '' &&
           this.returnDate().trim() !== '' &&
           this.kilosReturned() != null && this.kilosReturned()! > 0;
  });

  // --- Data from Service ---
  records = this.returnService.records;

  // --- Component Methods ---

  addReturn(): void {
    // Mark all fields as touched to show errors if the user tries to submit an empty form.
    Object.values(this.touched).forEach(state => state.set(true));

    if (!this.isFormValid()) {
      return;
    }
    
    this.returnService.addRecord({
      season: this.season(),
      reason: this.reason(),
      gardenMark: this.gardenMark(),
      invoiceNumber: this.invoiceNumber(),
      kilosReturned: this.kilosReturned()!,
      returnDate: this.returnDate()
    });

    this.clearForm();
  }

  clearForm(): void {
    this.season.set('');
    this.reason.set('');
    this.gardenMark.set('');
    this.invoiceNumber.set('');
    this.kilosReturned.set(null);
    this.returnDate.set('');

    // Reset touched states so errors disappear.
    Object.values(this.touched).forEach(state => state.set(false));
  }

  onExit(): void {
    console.log('Exit action triggered.');
  }
}
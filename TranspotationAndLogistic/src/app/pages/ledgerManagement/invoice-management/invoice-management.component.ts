import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceManagementService } from '../../../services/LedgerManagement/invoice-management.service'; // Adjust paths
import { Invoice } from '../../../models/invoice-manangement.model';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss']
})
export class InvoiceManagementComponent {
  private invoiceService = inject(InvoiceManagementService);
  private location = inject(Location);
  
  // Form Data Signals
  season = signal('');
  brokerName = signal('');
  grade = signal('');
  packingType = signal('');
  bulkType = signal<'Bulk' | 'Bag' | 'Box' | ''>('');
  dispatchDate = signal('');
  
  // Available options for dropdown
  bulkTypes: Invoice['bulkType'][] = ['Bulk', 'Bag', 'Box'];

  // Validation Signals
  seasonError = computed(() => !this.season() ? 'Season is required' : '');
  brokerNameError = computed(() => !this.brokerName() ? 'Broker Name is required' : '');
  gradeError = computed(() => !this.grade() ? 'Grade is required' : '');
  packingTypeError = computed(() => !this.packingType() ? 'Packing Type is required' : '');
  bulkTypeError = computed(() => !this.bulkType() ? 'Bulk type is required' : '');
  dispatchDateError = computed(() => !this.dispatchDate() ? 'Dispatch Date is required' : '');

  isFormValid = computed(() => 
    !this.seasonError() && !this.brokerNameError() && !this.gradeError() &&
    !this.packingTypeError() && !this.bulkTypeError() && !this.dispatchDateError()
  );
  
  // Data from service
  records = this.invoiceService.invoices;

  onSubmit(): void {
    if (this.isFormValid()) {
      const newRecord = {
        season: this.season(),
        brokerName: this.brokerName(),
        grade: this.grade(),
        packingType: this.packingType(),
        bulkType: this.bulkType() as Invoice['bulkType'],
        dispatchDate: this.dispatchDate()
      };
      this.invoiceService.addInvoice(newRecord);
      this.clearForm();
    }
  }

  clearForm(): void {
    this.season.set('');
    this.brokerName.set('');
    this.grade.set('');
    this.packingType.set('');
    this.bulkType.set('');
    this.dispatchDate.set('');
  }

  onExit(): void {
    this.location.back(); // Simple way to go to the previous page
  }
}
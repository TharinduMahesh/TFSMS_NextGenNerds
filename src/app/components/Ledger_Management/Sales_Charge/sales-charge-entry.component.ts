import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core'; // NEW: Added PLATFORM_ID, Inject
import { isPlatformBrowser, CommonModule } from '@angular/common'; // NEW: Added isPlatformBrowser
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation

import { SalesChargeEntryService } from '../../../Services/sales-charge-entry.service';
import { SalesCharge } from '../../../models/sales-charge.interface'; // Import the interface

@Component({
  selector: 'app-sales-charge-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-charge-entry.component.html',
  styleUrls: ['./sales-charge-entry.component.css']
})
export class SalesChargeEntryComponent implements OnInit {
  saleReference: string = '';
  chargeType: string = '';
  amount: number | null = null;
  chargeDate: string = new Date().toISOString().split('T')[0];
  description: string = '';

  chargeRecords: SalesCharge[] = [];
  editingChargeId: number | null = null;

  public isBrowser: boolean; // NEW: Declare isBrowser property

  constructor(
    private router: Router,
    private salesChargeEntryService: SalesChargeEntryService,
    @Inject(PLATFORM_ID) private platformId: Object // NEW: Inject PLATFORM_ID
  ) {
    // NEW: Initialize isBrowser in the constructor
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadChargeRecords();
  }

  loadChargeRecords(): void {
    this.salesChargeEntryService.getSalesCharges().subscribe({
      next: (data) => {
        this.chargeRecords = data.map(charge => ({
          ...charge,
          chargeDate: charge.chargeDate ? new Date(charge.chargeDate).toISOString().split('T')[0] : '',
          description: charge.description || ''
        })).sort((a, b) => new Date(b.chargeDate).getTime() - new Date(a.chargeDate).getTime());
        console.log('Sales Charge records loaded:', this.chargeRecords);
      },
      error: (error) => {
        console.error('Error loading sales charge records:', error);
        // NEW: Guard alert() call with isPlatformBrowser
        if (this.isBrowser) {
          alert('Failed to load sales charge records. Please try again.');
        }
      }
    });
  }

  clearForm(): void {
    this.saleReference = '';
    this.chargeType = '';
    this.amount = null;
    this.chargeDate = new Date().toISOString().split('T')[0];
    this.description = '';
    this.editingChargeId = null;
  }

  editCharge(charge: SalesCharge): void {
    this.editingChargeId = charge.id || null;
    this.saleReference = charge.saleReference;
    this.chargeType = charge.chargeType;
    this.amount = charge.amount;
    this.chargeDate = charge.chargeDate;
    this.description = charge.description || '';
  }

  addOrUpdateCharge(): void {
    if (!this.saleReference || !this.chargeType || this.amount === null || this.amount <= 0 || !this.chargeDate) {
      // NEW: Guard alert() call with isPlatformBrowser
      if (this.isBrowser) {
        alert('Please fill all required fields (Sale Reference, Charge Type, Amount, Charge Date) and ensure amount is positive.');
      }
      return;
    }

    const chargeToSave: SalesCharge = {
      id: this.editingChargeId || undefined,
      saleReference: this.saleReference,
      chargeType: this.chargeType,
      amount: this.amount,
      chargeDate: this.chargeDate,
      description: this.description || undefined
    };

    if (this.editingChargeId) {
      this.salesChargeEntryService.updateSalesCharge(this.editingChargeId, chargeToSave).subscribe({
        next: () => {
          // NEW: Guard alert() call with isPlatformBrowser
          if (this.isBrowser) {
            alert('Sales Charge updated successfully!');
          }
          this.clearForm();
          this.loadChargeRecords();
        },
        error: (error) => {
          console.error('Error updating sales charge:', error);
          // NEW: Guard alert() call with isPlatformBrowser
          if (this.isBrowser) {
            alert('Failed to update sales charge: ' + error.message);
          }
        }
      });
    } else {
      this.salesChargeEntryService.addSalesCharge(chargeToSave).subscribe({
        next: (addedRecord) => {
          // NEW: Guard alert() call with isPlatformBrowser
          if (this.isBrowser) {
            alert('Sales Charge added successfully!');
          }
          this.clearForm();
          this.loadChargeRecords();
        },
        error: (error) => {
          console.error('Error adding sales charge:', error);
          // NEW: Guard alert() call with isPlatformBrowser
          if (this.isBrowser) {
            alert('Failed to add sales charge: ' + error.message);
          }
        }
      });
    }
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      // NEW: Guard alert() call with isPlatformBrowser
      if (this.isBrowser) {
        alert('Cannot delete: Sales Charge ID is missing.');
      }
      return;
    }

    // NEW: Guard confirm() call with isPlatformBrowser
    const isConfirmed = this.isBrowser ? confirm('Are you sure you want to delete this sales charge? This action cannot be undone.') : true;

    if (isConfirmed) {
      this.salesChargeEntryService.deleteSalesCharge(id).subscribe({
        next: () => {
          // NEW: Guard alert() call with isPlatformBrowser
          if (this.isBrowser) {
            alert('Sales Charge deleted successfully!');
          }
          this.loadChargeRecords();
        },
        error: (error) => {
          console.error('Error deleting sales charge:', error);
          // NEW: Guard alert() call with isPlatformBrowser
          if (this.isBrowser) {
            alert('Failed to delete sales charge: ' + error.message);
          }
        }
      });
    }
  }

  /**
   * @method formatDate
   * @description Utility function to format date strings for display.
   * NEW: Added this method
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(); // For display
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

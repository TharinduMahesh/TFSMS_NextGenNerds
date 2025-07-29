import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';  // For NgModel
import { Router } from '@angular/router';       // For navigation
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';

import { SalesChargeEntryService } from '../../../Services/sales-charge-entry.service';
import { SalesCharge } from '../../../models/sales-charge.interface'; // Import the interface

@Component({
  selector: 'app-sales-charge-entry',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderComponent,SidebarComponent], // Removed HeaderComponent as it's not used in template
  templateUrl: './sales-charge-entry.component.html',
  styleUrls: ['./sales-charge-entry.component.css']
})
export class SalesChargeEntryComponent implements OnInit {
  // DEFINITIVE FIX: Initialize to null and use string | null type
  saleReference: string | null = null;
  chargeType: string = ''; // This is required and will always be a string
  amount: number | null = null;
  chargeDate: string | null = new Date().toISOString().split('T')[0]; // Initialize with date, but type is nullable
  description: string | null = null; // DEFINITIVE FIX: Initialize to null and use string | null type

  chargeRecords: SalesCharge[] = [];
  editingSalesChargeId: number | null = null;

  public isBrowser: boolean;

  constructor(
    private router: Router,
    private salesChargeEntryService: SalesChargeEntryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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
          // DEFINITIVE FIX: Map to string | null explicitly using || null
          // saleReference: charge.saleReference || null,
          chargeDate: charge.chargeDate ? new Date(charge.chargeDate).toISOString().split('T')[0] : null,
          description: charge.description || null // Map to null
        })).sort((a, b) => (b.salesChargeId || 0) - (a.salesChargeId || 0));
        console.log('Sales Charge records loaded:', this.chargeRecords);
      },
      error: (error) => {
        console.error('Error loading sales charge records:', error);
        if (this.isBrowser) {
          alert('Failed to load sales charge records. Please try again.');
        }
      }
    });
  }

  clearForm(): void {
    this.saleReference = null; // DEFINITIVE FIX: Clear to null
    this.chargeType = '';
    this.amount = null;
    this.chargeDate = new Date().toISOString().split('T')[0];
    this.description = null; // DEFINITIVE FIX: Clear to null
    this.editingSalesChargeId = null;
  }

  editCharge(charge: SalesCharge): void {
    this.editingSalesChargeId = charge.salesChargeId || null;
    // this.saleReference = charge.saleReference || null; // DEFINITIVE FIX: Assign to nullable
    this.chargeType = charge.chargeType;
    this.amount = charge.amount;
    this.chargeDate = charge.chargeDate || null; // DEFINITIVE FIX: Assign to nullable
    this.description = charge.description || null; // DEFINITIVE FIX: Assign to nullable
  }

  addOrUpdateCharge(): void {
    // Validation now checks for null for optional fields
    // If saleReference or chargeType or chargeDate are required by backend, they must be non-null here.
    // Assuming they are required for submission based on previous context.
    if (this.saleReference === null || !this.chargeType || this.amount === null || this.amount <= 0 || this.chargeDate === null) { // DEFINITIVE FIX: Check for null
      if (this.isBrowser) {
        alert('Please fill all required fields (Sale Reference, Charge Type, Amount, Charge Date) and ensure amount is positive.');
      }
      return;
    }

    const chargeToSave: SalesCharge = {
      salesChargeId: this.editingSalesChargeId || undefined,
      // saleReference: this.saleReference, // This is now string | null
      chargeType: this.chargeType,
      amount: this.amount,
      chargeDate: this.chargeDate, // This is now string | null
      description: this.description // This is now string | null
    };

    if (this.editingSalesChargeId) {
      this.salesChargeEntryService.updateSalesCharge(this.editingSalesChargeId, chargeToSave).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Sales Charge updated successfully!');
          }
          this.clearForm();
          this.loadChargeRecords();
        },
        error: (error) => {
          console.error('Error updating sales charge:', error);
          if (this.isBrowser) {
            alert('Failed to update sales charge: ' + error.message);
          }
        }
      });
    } else {
      this.salesChargeEntryService.addSalesCharge(chargeToSave).subscribe({
        next: (addedRecord) => {
          if (this.isBrowser) {
            alert('Sales Charge added successfully!');
          }
          this.clearForm();
          this.loadChargeRecords();
        },
        error: (error) => {
          console.error('Error adding sales charge:', error);
          if (this.isBrowser) {
            alert('Failed to add sales charge: ' + error.message);
          }
        }
      });
    }
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      if (this.isBrowser) {
        alert('Cannot delete: Sales Charge ID is missing.');
      }
      return;
    }

    const isConfirmed = this.isBrowser ? confirm('Are you sure you want to delete this sales charge? This action cannot be undone.') : true;

    if (isConfirmed) {
      this.salesChargeEntryService.deleteSalesCharge(id).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Sales Charge deleted successfully!');
          }
          this.loadChargeRecords();
        },
        error: (error) => {
          console.error('Error deleting sales charge:', error);
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
   */
  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

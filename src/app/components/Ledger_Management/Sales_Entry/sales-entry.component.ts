// src/app/components/Ledger_Management/Sales_Entry/sales-entry/sales-entry.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from "../../header/header.component"; // Import HeaderComponent

import { SalesEntryService } from '../../../Services/sales-entry.service'; // Import the new service
import { SalesEntry } from '../../../models/sales-entry.interface'; // Import the SalesEntry interface

@Component({
  selector: 'app-sales-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Added HeaderComponent to imports
  templateUrl: './sales-entry.component.html',
  styleUrls: ['./sales-entry.component.css']
})
export class SalesEntryComponent implements OnInit {

  // --- Form Properties ---
  invoiceNumber: string = ''; // DEFINITIVE FIX: Re-added invoiceNumber property
  saleDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  customerName: string = '';
  teaGrade: string = ''; // Will be bound to dropdown
  quantityKg: number | null = null;
  unitPriceKg: number | null = null;
  totalAmount: number | null = null;

  // Predefined options for Tea Grade dropdown
  teaGrades: string[] = [
    'BOPF', 'FBOP', 'OP', 'Pekoe', 'Green Tea Sencha',
    'Earl Grey Blend', 'Chamomile Infusion', 'Ceylon Black Tea', 'Dust'
  ];

  // --- Data Table Properties ---
  salesRecords: SalesEntry[] = [];
  editingEntryId: number | null = null; // To track if we are editing

  public isBrowser: boolean; // To check if running in browser environment

  constructor(
    private router: Router,
    private salesEntryService: SalesEntryService, // Inject the Sales Entry Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadSalesRecords();
  }

  /**
   * @method loadSalesRecords
   * @description Fetches sales entries data from the backend using the SalesEntryService.
   */
  loadSalesRecords(): void {
    this.salesEntryService.getSalesEntries().subscribe({
      next: (data) => {
        this.salesRecords = data.map(entry => ({
          ...entry,
          saleDate: entry.saleDate ? new Date(entry.saleDate).toISOString().split('T')[0] : '', // Ensure YYYY-MM-DD
          createdAt: entry.createdAt || null,
          updatedAt: entry.updatedAt || null
        })).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()); // Sort by date descending

        console.log('Sales records loaded:', this.salesRecords);
      },
      error: (error) => {
        console.error('Error loading sales records:', error);
        if (this.isBrowser) {
          alert('Failed to load sales records. Please try again.');
        }
      }
    });
  }

  /**
   * @method clearForm
   * @description Clears the form fields and resets the editing state.
   */
  clearForm(): void {
    this.invoiceNumber = ''; // DEFINITIVE FIX: Clear invoiceNumber
    this.saleDate = new Date().toISOString().split('T')[0];
    this.customerName = '';
    this.teaGrade = '';
    this.quantityKg = null;
    this.unitPriceKg = null;
    this.totalAmount = null;
    this.editingEntryId = null; // Clear editing state
  }

  /**
   * @method calculateTotalAmount
   * @description Calculates total amount based on quantity and unit price.
   */
  calculateTotalAmount(): void {
    if (this.quantityKg !== null && this.unitPriceKg !== null) {
      this.totalAmount = parseFloat((this.quantityKg * this.unitPriceKg).toFixed(2));
    } else {
      this.totalAmount = null;
    }
  }

  /**
   * @method editEntry
   * @description Populates the form with data from a selected sales entry for editing.
   * @param entry The SalesEntry object to edit.
   */
  editEntry(entry: SalesEntry): void {
    this.editingEntryId = entry.id || null;
    this.invoiceNumber = entry.invoiceNumber; // DEFINITIVE FIX: Populate invoiceNumber
    this.saleDate = entry.saleDate;
    this.customerName = entry.customerName;
    this.teaGrade = entry.teaGrade;
    this.quantityKg = entry.quantityKg;
    this.unitPriceKg = entry.unitPriceKg;
    this.totalAmount = entry.totalAmount;
  }

  /**
   * @method addOrUpdateEntry
   * @description Adds a new sales entry or updates an existing one.
   */
  addOrUpdateEntry(): void {
    // Basic validation
    if (!this.invoiceNumber || !this.saleDate || !this.customerName || !this.teaGrade ||
        this.quantityKg === null || this.quantityKg <= 0 ||
        this.unitPriceKg === null || this.unitPriceKg <= 0 ||
        this.totalAmount === null || this.totalAmount <= 0) {
      if (this.isBrowser) {
        alert('Please fill all required fields and ensure quantities/amounts are positive.');
      }
      return;
    }

    const entryToSave: SalesEntry = {
      id: this.editingEntryId || undefined,
      invoiceNumber: this.invoiceNumber, // DEFINITIVE FIX: Include invoiceNumber
      saleDate: this.saleDate,
      customerName: this.customerName,
      teaGrade: this.teaGrade,
      quantityKg: this.quantityKg,
      unitPriceKg: this.unitPriceKg,
      totalAmount: this.totalAmount,
    };

    if (this.editingEntryId) {
      this.salesEntryService.updateSalesEntry(this.editingEntryId, entryToSave).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Sales Entry updated successfully!');
          }
          this.clearForm();
          this.loadSalesRecords(); // Reload data to reflect update
        },
        error: (error) => {
          console.error('Error updating sales entry:', error);
          if (this.isBrowser) {
            alert('Failed to update sales entry: ' + error.message);
          }
        }
      });
    } else {
      this.salesEntryService.addSalesEntry(entryToSave).subscribe({
        next: (addedRecord) => {
          if (this.isBrowser) {
            alert('Sales Entry added successfully!');
          }
          this.clearForm();
          this.loadSalesRecords(); // Reload data to get the new entry with its ID
        },
        error: (error) => {
          console.error('Error adding sales entry:', error);
          if (this.isBrowser) {
            alert('Failed to add sales entry: ' + error.message);
          }
        }
      });
    }
  }

  /**
   * @method confirmDelete
   * @description Confirms and deletes a sales entry.
   * @param id The ID of the sales entry to delete.
   */
  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      if (this.isBrowser) {
        alert('Cannot delete: Sales Entry ID is missing.');
      }
      return;
    }

    const isConfirmed = this.isBrowser ? confirm('Are you sure you want to delete this sales entry? This action cannot be undone.') : true;

    if (isConfirmed) {
      this.salesEntryService.deleteSalesEntry(id).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Sales Entry deleted successfully!');
          }
          this.loadSalesRecords(); // Reload data to remove the deleted entry
        },
        error: (error) => {
          console.error('Error deleting sales entry:', error);
          if (this.isBrowser) {
            alert('Failed to delete sales entry: ' + error.message);
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
      return date.toLocaleDateString(); // For display
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  /**
   * @method exitPage
   * @description Navigates the user back to the ledger management page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

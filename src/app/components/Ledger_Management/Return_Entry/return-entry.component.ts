// src/app/components/Ledger_Management/Return_Entry/return-entry.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from '../../header/header.component'; // Import Header component
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component'; // Import Sidebar component

import { ReturnEntryService } from '../../../Services/return-entry.service'; // Import the new service
import { ReturnEntry } from '../../../models/return-analysis.interface'; // Import the ReturnEntry interface

@Component({
  selector: 'app-return-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './return-entry.component.html',
  styleUrls: ['./return-entry.component.css']
})
export class ReturnEntryComponent implements OnInit {

  // --- Form Properties ---
  invoiceNumber: string = '';
  kilosReturned: number | null = null;
  reason: string = ''; // Will be bound to dropdown
  returnDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  season: string = '';
  gardenMark: string = '';

  // NEW: Predefined options for Return Reason dropdown
  returnReasons: string[] = [
    'Excess Stock',
    'Damaged in Transit',
    'Quality Issue',
    'Incorrect Item Shipped',
    'Late Delivery',
    'Customer Changed Mind',
    'Expired Product',
    'Other'
  ];

  // --- Data Table Properties ---
  returnRecords: ReturnEntry[] = [];
  editingEntryId: number | null = null; // To track if we are editing
  editingEntryCreatedAt: string | undefined; // To store original createdAt for updates

  public isBrowser: boolean; // To check if running in browser environment

  constructor(
    private router: Router,
    private returnEntryService: ReturnEntryService, // Inject the Return Entry Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadReturnRecords();
  }

  /**
   * @method loadReturnRecords
   * @description Fetches return entries data from the backend using the ReturnEntryService.
   */
  loadReturnRecords(): void {
    this.returnEntryService.getReturnEntries().subscribe({
      next: (data) => {
        this.returnRecords = data.map(entry => ({
          ...entry,
          returnDate: entry.returnDate ? new Date(entry.returnDate).toISOString().split('T')[0] : '', // Ensure YYYY-MM-DD
          season: entry.season || '',
          gardenMark: entry.gardenMark || '',
          createdAt: entry.createdAt || undefined,
          updatedAt: entry.updatedAt || undefined
        })).sort((a, b) => new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime()); // Sort by date descending

        console.log('Return records loaded:', this.returnRecords);
      },
      error: (error) => {
        console.error('Error loading return records:', error);
        if (this.isBrowser) {
          alert('Failed to load return records. Please try again.');
        }
      }
    });
  }

  /**
   * @method clearForm
   * @description Clears the form fields and resets the editing state.
   */
  clearForm(): void {
    this.invoiceNumber = '';
    this.kilosReturned = null;
    this.reason = ''; // Clear reason
    this.returnDate = new Date().toISOString().split('T')[0]; // Reset to today
    this.season = '';
    this.gardenMark = '';
    this.editingEntryId = null;
    this.editingEntryCreatedAt = undefined;
  }

  /**
   * @method editEntry
   * @description Populates the form with data from a selected return entry for editing.
   * @param entry The ReturnEntry object to edit.
   */
  editEntry(entry: ReturnEntry): void {
    this.editingEntryId = entry.id || null;
    this.invoiceNumber = entry.invoiceNumber;
    this.kilosReturned = entry.kilosReturned;
    this.reason = entry.reason; // Populate reason
    this.returnDate = entry.returnDate;
    this.season = entry.season;
    this.gardenMark = entry.gardenMark;
    this.editingEntryCreatedAt = entry.createdAt;
  }

  /**
   * @method addOrUpdateEntry
   * @description Adds a new return entry or updates an existing one.
   */
  addOrUpdateEntry(): void {
    // Basic validation
    if (!this.invoiceNumber || this.kilosReturned === null || this.kilosReturned <= 0 || !this.reason || !this.returnDate || !this.season || !this.gardenMark) {
      if (this.isBrowser) {
        alert('Please fill all required fields (Invoice Number, Kilos Returned, Reason, Return Date, Season, Garden Mark) and ensure kilos are positive.');
      }
      return;
    }

    const entryToSave: ReturnEntry = {
      id: this.editingEntryId || undefined,
      invoiceNumber: this.invoiceNumber,
      kilosReturned: this.kilosReturned,
      reason: this.reason,
      returnDate: this.returnDate,
      season: this.season,
      gardenMark: this.gardenMark,
      createdAt: this.editingEntryId ? this.editingEntryCreatedAt : undefined,
      updatedAt: this.editingEntryId ? new Date().toISOString() : undefined
    };

    if (this.editingEntryId) {
      this.returnEntryService.updateReturnEntry(this.editingEntryId, entryToSave).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Return Entry updated successfully!');
          }
          this.clearForm();
          this.loadReturnRecords();
        },
        error: (error) => {
          console.error('Error updating return entry:', error);
          if (this.isBrowser) {
            alert('Failed to update return entry: ' + error.message);
          }
        }
      });
    } else {
      this.returnEntryService.addReturnEntry(entryToSave).subscribe({
        next: (addedRecord) => {
          if (this.isBrowser) {
            alert('Return Entry added successfully!');
          }
          this.clearForm();
          this.loadReturnRecords();
        },
        error: (error) => {
          console.error('Error adding return entry:', error);
          if (this.isBrowser) {
            alert('Failed to add return entry: ' + error.message);
          }
        }
      });
    }
  }

  /**
   * @method confirmDelete
   * @description Confirms and deletes a return entry.
   * @param id The ID of the return entry to delete.
   */
  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      if (this.isBrowser) {
        alert('Cannot delete: Return Entry ID is missing.');
      }
      return;
    }

    const isConfirmed = this.isBrowser ? confirm('Are you sure you want to delete this return entry? This action cannot be undone.') : true;

    if (isConfirmed) {
      this.returnEntryService.deleteReturnEntry(id).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Return Entry deleted successfully!');
          }
          this.loadReturnRecords();
        },
        error: (error) => {
          console.error('Error deleting return entry:', error);
          if (this.isBrowser) {
            alert('Failed to delete return entry: ' + error.message);
          }
        }
      });
    }
  }

  /**
   * @method formatDate
   * @description Utility function to format date strings for display.
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

  /**
   * @method exitPage
   * @description Navigates the user back to the ledger management page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

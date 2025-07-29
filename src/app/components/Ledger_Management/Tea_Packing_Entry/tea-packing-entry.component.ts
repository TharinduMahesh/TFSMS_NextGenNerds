// src/app/components/Ledger_Management/Tea_Packing_Entry/tea-packing-entry.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation

import { PackedTeaService } from '../../../Services/packed-tea.service'; // Import the new service
import { PackedTea } from '../../../models/packed-tea.interface'; // Import the PackedTea interface

@Component({
  selector: 'app-tea-packing-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-packing-entry.component.html',
  styleUrls: ['./tea-packing-entry.component.css']
})
export class TeaPackingEntryComponent implements OnInit {

  // --- Form Properties (Matching PackedTea model) ---
  grade: string | null = null;
  gardenMark: string = '';
  financialYear: number = new Date().getFullYear();
  packingType: string | null = null;
  initialWeightKg: number | null = null;
  packingDate: string = new Date().toISOString().split('T')[0];

  // Predefined options for dropdowns
  teaGrades: string[] = ['BOPF', 'FBOP', 'OP', 'Pekoe', 'Green Tea Sencha', 'Ceylon Black Tea', 'Dust', 'Other'];
  packingTypes: string[] = ['Paper Sack', 'Wooden Chest', 'Bag', 'Other'];

  // --- Data Table Properties (Displaying Packed Tea Records) ---
  packedTeaRecords: PackedTea[] = [];
  editingPackedTeaId: number | null = null; // To track if we are editing

  public isBrowser: boolean; // To check if running in browser environment

  constructor(
    private router: Router,
    private packedTeaService: PackedTeaService, // Inject the PackedTea Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadPackedTeaRecords();
  }

  /**
   * @method loadPackedTeaRecords
   * @description Fetches packed tea entries data from the backend.
   */
  loadPackedTeaRecords(): void {
    this.packedTeaService.getPackedTeas().subscribe({
      next: (data) => {
        this.packedTeaRecords = data.map(entry => ({
          ...entry,
          packingDate: entry.packingDate ? new Date(entry.packingDate).toISOString().split('T')[0] : '', // Ensure YYYY-MM-DD
          grade: entry.grade || null,
          gardenMark: entry.gardenMark || '',
          packingType: entry.packingType || null,
        })).sort((a, b) => new Date(b.packingDate).getTime() - new Date(a.packingDate).getTime()); // Sort by date descending

        console.log('Packed Tea records loaded:', this.packedTeaRecords);
        console.log('Stock Ledger Entry: ',this.packedTeaRecords.map(record => record.stockLedgerEntry?.status));
      },
      error: (error) => {
        console.error('Error loading packed tea records:', error);
        if (this.isBrowser) {
          alert('Failed to load packed tea records. Please try again.');
        }
      }
    });
  }

  /**
   * @method clearForm
   * @description Clears the form fields and resets the editing state.
   */
  clearForm(): void {
    this.grade = null;
    this.gardenMark = '';
    this.financialYear = new Date().getFullYear();
    this.packingType = null;
    this.initialWeightKg = null;
    this.packingDate = new Date().toISOString().split('T')[0];
    this.editingPackedTeaId = null;
  }

  /**
   * @method editPackedTea
   * @description Populates the form with data from a selected packed tea entry for editing.
   * @param entry The PackedTea object to edit.
   */
  editPackedTea(entry: PackedTea): void {
    this.editingPackedTeaId = entry.packedTeaId || null;
    this.grade = entry.grade;
    this.gardenMark = entry.gardenMark;
    this.financialYear = entry.financialYear;
    this.packingType = entry.packingType;
    this.initialWeightKg = entry.initialWeightKg;
    this.packingDate = entry.packingDate;
  }

  /**
   * @method addOrUpdatePackedTea
   * @description Adds a new packed tea entry or updates an existing one.
   */
  // addOrUpdatePackedTea(): void {
  //   // Basic validation (now checks for null for dropdowns)
  //   if (!this.grade || !this.gardenMark || !this.financialYear || !this.packingType ||
  //       this.initialWeightKg === null || this.initialWeightKg <= 0 || !this.packingDate) {
  //     if (this.isBrowser) {
  //       alert('Please fill all required fields and ensure initial weight is positive.');
  //     }
  //     return;
  //   }

  //   const entryToSave: PackedTea = {
  //     packedTeaId: this.editingPackedTeaId || undefined,
  //     grade: this.grade,
  //     gardenMark: this.gardenMark,
  //     financialYear: this.financialYear,
  //     packingType: this.packingType,
  //     initialWeightKg: this.initialWeightKg,
  //     packingDate: this.packingDate,
  //   };

  //   if (this.editingPackedTeaId) {
  //     this.packedTeaService.updatePackedTea(this.editingPackedTeaId, entryToSave).subscribe({
  //       next: () => {
  //         if (this.isBrowser) {
  //           alert('Packed Tea entry updated successfully!');
  //         }
  //         this.clearForm();
  //         this.loadPackedTeaRecords(); // Reload data
  //       },
  //       error: (error) => {
  //         console.error('Error updating packed tea entry:', error);
  //         if (this.isBrowser) {
  //           alert('Failed to update packed tea entry: ' + error.message);
  //         }
  //       }
  //     });
  //   } else {
  //     this.packedTeaService.addPackedTea(entryToSave).subscribe({
  //       next: (addedRecord) => {
  //         if (this.isBrowser) {
  //           alert('Packed Tea entry added successfully! A new Stock Ledger Entry was also created.');
  //         }
  //         this.clearForm();
  //         this.loadPackedTeaRecords(); // Reload data
  //       },
  //       error: (error) => {
  //         console.error('Error adding packed tea entry:', error);
  //         if (this.isBrowser) {
  //           alert('Failed to add packed tea entry: ' + error.message);
  //         }
  //       }
  //     });
  //   }
  // }

  addOrUpdatePackedTea(): void {
  // Enhanced validation - ensure dropdowns have valid selections
  if (!this.grade || this.grade.trim() === '' || 
      !this.gardenMark || this.gardenMark.trim() === '' || 
      !this.financialYear || 
      !this.packingType || this.packingType.trim() === '' ||
      this.initialWeightKg === null || this.initialWeightKg <= 0 || 
      !this.packingDate) {
    if (this.isBrowser) {
      alert('Please fill all required fields and ensure initial weight is positive.');
    }
    return;
  }

  const entryToSave: PackedTea = {
    packedTeaId: this.editingPackedTeaId || undefined,
    grade: this.grade.trim(),
    gardenMark: this.gardenMark.trim(),
    financialYear: this.financialYear,
    packingType: this.packingType.trim(),
    initialWeightKg: this.initialWeightKg,
    packingDate: this.packingDate,
  };

  if (this.editingPackedTeaId) {
    this.packedTeaService.updatePackedTea(this.editingPackedTeaId, entryToSave).subscribe({
      next: () => {
        if (this.isBrowser) {
          alert('Packed Tea entry updated successfully!');
        }
        this.clearForm();
        this.loadPackedTeaRecords();
      },
      error: (error) => {
        console.error('Error updating packed tea entry:', error);
        if (this.isBrowser) {
          alert('Failed to update packed tea entry: ' + error.message);
        }
      }
    });
  } else {
    this.packedTeaService.addPackedTea(entryToSave).subscribe({
      next: (addedRecord) => {
        if (this.isBrowser) {
          alert('Packed Tea entry added successfully! A new Stock Ledger Entry was also created.');
        }
        this.clearForm();
        this.loadPackedTeaRecords();
      },
      error: (error) => {
        console.error('Error adding packed tea entry:', error);
        if (this.isBrowser) {
          alert('Failed to add packed tea entry: ' + error.message);
        }
      }
    });
  }
}

  /**
   * @method confirmDelete
   * @description Confirms and deletes a packed tea entry.
   * @param id The ID of the packed tea to delete.
   */
  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      if (this.isBrowser) {
        alert('Cannot delete: Packed Tea ID is missing.');
      }
      return;
    }

    const isConfirmed = this.isBrowser ? confirm('Are you sure you want to delete this packed tea entry? This will also delete its associated Stock Ledger Entry.') : true;

    if (isConfirmed) {
      this.packedTeaService.deletePackedTea(id).subscribe({
        next: () => {
          if (this.isBrowser) {
            alert('Packed Tea entry deleted successfully!');
          }
          this.loadPackedTeaRecords(); // Reload data
        },
        error: (error) => {
          console.error('Error deleting packed tea entry:', error);
          if (this.isBrowser) {
            alert('Failed to delete packed tea entry: ' + error.message);
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
   * @method navigateToInvoiceCreation
   * @description Navigates to the invoice creation page, passing the StockLedgerEntryId.
   * This method is added to TeaPackingEntryComponent as well if you want to create invoice directly from here.
   * @param stockLedgerEntryId The ID of the StockLedgerEntry to invoice.
   */
  navigateToInvoiceCreation(stockLedgerEntryId: number | undefined): void {
    if (stockLedgerEntryId === undefined) {
      if (this.isBrowser) {
        alert('Cannot create invoice: Stock Ledger Entry ID is missing.');
      }
      return;
    }
    this.router.navigate(['/ledger-management/invoice-creation'], { queryParams: { stockId: stockLedgerEntryId } });
  }

  /**
   * @method exitPage
   * @description Navigates the user back to the ledger management page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

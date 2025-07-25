// src/app/components/Ledger_Management/Claims_Entry/claims-entry/claims-entry.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { ClaimEntryService } from '../../../Services/claim-entry.service'; // Import the service
import { ClaimEntry } from '../../../models/claim-entry.interface'; // Import the interface

@Component({
  selector: 'app-claims-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claims-entry.component.html',
  styleUrls: ['./claims-entry.component.css']
})
export class ClaimsEntryComponent implements OnInit {
  claimType: string = '';
  invoiceNumber: string = '';
  quantity: number | null = null;
  returnDate: string = new Date().toISOString().split('T')[0]; // Default to today's date (YYYY-MM-DD)
  remark: string = '';
  // NEW: Add resolutionType property for form binding
  resolutionType: string = ''; // Initialize as empty string

  // NEW: Define options for the Resolution Type dropdown
  resolutionTypes: string[] = [
    'Pending',
    'Approved - Full Credit',
    'Approved - Partial Refund',
    'Approved - Replacement',
    'Approved - Discount',
    'Rejected',
    'Closed - No Action',
    'Escalated'
  ];

  claimRecords: ClaimEntry[] = [];
  editingClaimId: number | null = null; // To track if we are editing

  constructor(private router: Router, private claimEntryService: ClaimEntryService) {}

  ngOnInit(): void {
    this.loadClaimRecords();
  }

  loadClaimRecords(): void {
    this.claimEntryService.getClaimEntries().subscribe({
      next: (data) => {
        this.claimRecords = data.map(claim => ({
          ...claim,
          returnDate: claim.returnDate ? new Date(claim.returnDate).toISOString().split('T')[0] : '',
          // NEW: Ensure resolutionType is mapped correctly, default to empty string if null
          resolutionType: claim.resolutionType || ''
        })).sort((a, b) => (b.id || 0) - (a.id || 0)); // Sort by ID descending
        console.log('Claim records loaded:', this.claimRecords);
      },
      error: (error) => {
        console.error('Error loading claim records:', error);
        alert('Failed to load claim records. Please try again.'); // Replace with better notification
      }
    });
  }

  clearForm(): void {
    this.claimType = '';
    this.invoiceNumber = '';
    this.quantity = null;
    this.returnDate = new Date().toISOString().split('T')[0]; // Reset to today
    this.remark = '';
    // NEW: Clear resolutionType
    this.resolutionType = '';
    this.editingClaimId = null; // Clear editing state
  }

  editClaim(claim: ClaimEntry): void {
    this.editingClaimId = claim.id || null; // Set the ID of the claim being edited
    this.claimType = claim.claimType;
    this.invoiceNumber = claim.invoiceNumber;
    this.quantity = claim.quantity;
    this.returnDate = claim.returnDate;
    this.remark = claim.remark;
    // NEW: Populate resolutionType when editing
    this.resolutionType = claim.resolutionType || '';
  }

  addOrUpdateClaim(): void {
    // Basic validation
    if (!this.claimType || !this.invoiceNumber || this.quantity === null || !this.returnDate) {
      alert('Please fill in all required fields (Claim Type, Invoice Number, Quantity, Return Date).');
      return;
    }

    // Ensure values are numbers and non-negative
    if (this.quantity < 0) {
      alert('Quantity must be a non-negative value.');
      return;
    }

    // Convert returnDate string (YYYY-MM-DD) to a full ISO string for backend
    const dateToSend = new Date(this.returnDate);
    const isoReturnDate = dateToSend.toISOString();

    const claimToSave: ClaimEntry = {
      id: this.editingClaimId || undefined, // Include ID if editing, otherwise undefined
      claimType: this.claimType,
      invoiceNumber: this.invoiceNumber,
      quantity: this.quantity,
      returnDate: isoReturnDate, // Send as ISO string
      remark: this.remark,
      // NEW: Include resolutionType when saving/updating
      resolutionType: this.resolutionType || undefined // Send undefined if empty
    };

    if (this.editingClaimId) {
      // If editingClaimId is set, it means we are updating an existing entry
      this.claimEntryService.updateClaimEntry(this.editingClaimId, claimToSave).subscribe({
        next: () => {
          alert('Claim updated successfully!');
          this.clearForm(); // Clear form and reset editing state
          this.loadClaimRecords(); // Reload data to reflect update and maintain sort order
        },
        error: (error) => {
          console.error('Error updating claim:', error);
          alert('Failed to update claim: ' + error.message);
        }
      });
    } else {
      // Otherwise, we are adding a new entry
      this.claimEntryService.addClaimEntry(claimToSave).subscribe({
        next: (addedClaim) => {
          alert('Claim added successfully!');
          this.clearForm(); // Clear the form after successful submission
          this.loadClaimRecords(); // Reload data to get the new claim with its ID and maintain sort order
        },
        error: (error) => {
          console.error('Error adding claim:', error);
          alert('Failed to add claim: ' + error.message);
        }
      });
    }
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      alert('Cannot delete: Claim ID is missing.');
      return;
    }

    const isConfirmed = confirm('Are you sure you want to delete this claim? This action cannot be undone.');

    if (isConfirmed) {
      this.claimEntryService.deleteClaimEntry(id).subscribe({
        next: () => {
          alert('Claim deleted successfully!');
          this.loadClaimRecords(); // Reload data to remove the deleted entry from the table
        },
        error: (error) => {
          console.error('Error deleting claim:', error);
          alert('Failed to delete claim: ' + error.message);
        }
      });
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

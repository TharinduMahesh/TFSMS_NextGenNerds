import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { ClaimAdjustmentService } from '../../../Services/claim-adjustment.service';
import { ClaimAdjustment } from '../../../models/claim-adjustment.interface'; // Import the interface

@Component({
  selector: 'app-claims-adjustment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claim-adjustment.component.html',
  styleUrls: ['./claim-adjustment.component.css']
})
export class ClaimsAdjustmentComponent implements OnInit {
  claimReference: string = '';
  adjustmentType: string = '';
  adjustmentDetails: string = '';
  adjustmentDate: string = new Date().toISOString().split('T')[0]; // Default to today
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

  adjustmentRecords: ClaimAdjustment[] = [];
  editingClaimAdjustmentId: number | null = null; // To track if we are editing

  constructor(private router: Router, private claimAdjustmentService: ClaimAdjustmentService) {}

  ngOnInit(): void {
    this.loadAdjustmentRecords();
  }

  loadAdjustmentRecords(): void {
    this.claimAdjustmentService.getClaimAdjustments().subscribe({
      next: (data) => {
        this.adjustmentRecords = data.map(adjustment => ({
          ...adjustment,
          adjustmentDate: new Date(adjustment.adjustmentDate).toISOString().split('T')[0], // Ensure YYYY-MM-DD
          // NEW: Ensure resolutionType is mapped correctly, default to empty string if null
          resolutionType: adjustment.resolutionType || ''
        })).sort((a, b) => new Date(b.adjustmentDate).getTime() - new Date(a.adjustmentDate).getTime()); // Sort by date descending
        console.log('Adjustment records loaded:', this.adjustmentRecords);
      },
      error: (error) => {
        console.error('Error loading adjustment records:', error);
        alert('Failed to load adjustment records: ' + error.message);
      }
    });
  }

  clearForm(): void {
    this.claimReference = '';
    this.adjustmentType = '';
    this.adjustmentDetails = '';
    this.adjustmentDate = new Date().toISOString().split('T')[0];
    // NEW: Clear resolutionType
    this.resolutionType = '';
    this.editingClaimAdjustmentId = null; // Clear editing state
  }

  editAdjustment(adjustment: ClaimAdjustment): void {
    this.editingClaimAdjustmentId = adjustment.id || null;
    this.claimReference = adjustment.claimReference;
    this.adjustmentType = adjustment.adjustmentType;
    this.adjustmentDetails = adjustment.adjustmentDetails;
    this.adjustmentDate = adjustment.adjustmentDate;
    // NEW: Populate resolutionType when editing
    this.resolutionType = adjustment.resolutionType || '';
  }

  addOrUpdateAdjustment(): void {
    if (!this.claimReference || !this.adjustmentType || !this.adjustmentDetails || !this.adjustmentDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const adjustmentToSave: ClaimAdjustment = {
      id: this.editingClaimAdjustmentId || undefined,
      claimReference: this.claimReference,
      adjustmentType: this.adjustmentType,
      adjustmentDetails: this.adjustmentDetails,
      adjustmentDate: this.adjustmentDate,
      // NEW: Include resolutionType when saving/updating
      resolutionType: this.resolutionType || undefined // Send undefined if empty
    };

    if (this.editingClaimAdjustmentId) {
      // Update existing adjustment
      this.claimAdjustmentService.updateClaimAdjustment(this.editingClaimAdjustmentId, adjustmentToSave).subscribe({
        next: () => {
          alert('Adjustment updated successfully!');
          this.clearForm();
          this.loadAdjustmentRecords(); // Refresh the list
        },
        error: (error) => {
          console.error('Error updating adjustment:', error);
          alert('Failed to update adjustment: ' + error.message);
        }
      });
    } else {
      // Add new adjustment
      this.claimAdjustmentService.addClaimAdjustment(adjustmentToSave).subscribe({
        next: (addedAdjustment) => {
          alert('Adjustment added successfully!');
          this.clearForm();
          this.loadAdjustmentRecords(); // Refresh the list
        },
        error: (error) => {
          console.error('Error adding adjustment:', error);
          alert('Failed to add adjustment: ' + error.message);
        }
      });
    }
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      alert('Cannot delete: Adjustment ID is missing.');
      return;
    }
    const isConfirmed = confirm('Are you sure you want to delete this adjustment? This action cannot be undone.');
    if (isConfirmed) {
      this.claimAdjustmentService.deleteClaimAdjustment(id).subscribe({
        next: () => {
          alert('Adjustment deleted successfully!');
          this.loadAdjustmentRecords(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting adjustment:', error);
          alert('Failed to delete adjustment: ' + error.message);
        }
      });
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

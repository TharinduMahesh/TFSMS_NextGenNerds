import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimsService } from '../../../Services/claims.service';
import { Claim } from '../../../models/claim.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-claims-and-returns',
  templateUrl: './claims-and-returns.component.html',
  styleUrls: ['./claims-and-returns.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClaimsAndReturnsComponent implements OnInit {
  selectedSeason = 'All Seasons';
  selectedStatus = 'All Statuses';
  selectedStartDate = '';
  selectedEndDate = '';

  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  totalReturns: number = 0;
  totalClaimsApproved: number = 0;
  totalClaimsPending: number = 0;
  totalClaimsRejected: number = 0;

  showEditModal = false;
  editingClaim: Claim | null = null;

  constructor(private claimsService: ClaimsService) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.claimsService.getClaims().subscribe({
      next: (data: Claim[]) => {
        this.claims = data;
        this.filterClaims();
      },
      error: (error: unknown) => {
        console.error('Error loading claims:', error);
        alert('Failed to load claims. Please try again.');
      }
    });
  }

  filterClaims(): void {
    this.filteredClaims = this.claims.filter(claim => {
      const matchesSeason = this.selectedSeason === 'All Seasons' || claim.season === this.selectedSeason;
      const matchesStatus = this.selectedStatus === 'All Statuses' || claim.status === this.selectedStatus;
      const matchesStartDate = !this.selectedStartDate || new Date(claim.returnDate) >= new Date(this.selectedStartDate);
      const matchesEndDate = !this.selectedEndDate || new Date(claim.returnDate) <= new Date(this.selectedEndDate);

      return matchesSeason && matchesStatus && matchesStartDate && matchesEndDate;
    });

    this.updateSummary();
  }

  updateSummary(): void {
    this.totalReturns = this.filteredClaims.reduce((sum, claim) => sum + claim.kilosReturned, 0);
    this.totalClaimsApproved = this.filteredClaims.filter(claim => claim.status === 'Approved').length;
    this.totalClaimsPending = this.filteredClaims.filter(claim => claim.status === 'Pending').length;
    this.totalClaimsRejected = this.filteredClaims.filter(claim => claim.status === 'Rejected').length;
  }

  addNewClaim(): void {
    this.editingClaim = {
      id: 0,
      season: '',
      gardenMark: '',
      invoice: '',
      returnDate: new Date().toISOString().split('T')[0],
      kilosReturned: 0,
      status: 'Pending'
    };
    this.showEditModal = true;
  }

  editClaim(claim: Claim): void {
    this.editingClaim = { ...claim };
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (!this.editingClaim) return;
  
    let operation: Observable<any>;
    if (this.editingClaim.id === 0) {
      operation = this.claimsService.createClaim(this.editingClaim);
    } else {
      operation = this.claimsService.updateClaim(this.editingClaim);
    }
  
    operation.subscribe({
      next: () => {
        this.loadClaims();
        this.showEditModal = false;
        this.editingClaim = null;
      },
      error: (error: unknown) => {
        console.error('Error saving claim:', error);
        alert('Failed to save claim. Please try again.');
      }
    });
  }
  

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingClaim = null;
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.deleteClaim(id);
    }
  }

  deleteClaim(id: number): void {
    this.claimsService.deleteClaim(id).subscribe({
      next: () => {
        this.loadClaims();
      },
      error: (error: unknown) => {
        console.error('Error deleting claim:', error);
        alert('Failed to delete claim. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
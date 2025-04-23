import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Claim {
  season: string;
  gardenMark: string;
  invoice: string;
  returnDate: string;
  kilosReturned: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

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

  claims: Claim[] = [
    { season: 'Season01', gardenMark: 'GM-001', invoice: 'INV123', returnDate: '2024-12-01', kilosReturned: 30, status: 'Approved' },
    { season: 'Season02', gardenMark: 'GM-002', invoice: 'INV124', returnDate: '2024-12-05', kilosReturned: 30, status: 'Pending' },
    { season: 'Season03', gardenMark: 'GM-003', invoice: 'INV125', returnDate: '2024-12-10', kilosReturned: 20, status: 'Rejected' }
  ];

  filteredClaims: Claim[] = [];
  totalReturns: number = 0;
  totalClaimsApproved: number = 0;
  totalClaimsPending: number = 0;
  totalClaimsRejected: number = 0;

  ngOnInit(): void {
    this.filterClaims();
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Pending':
        return 'pending';
      case 'Rejected':
        return 'rejected';
      default:
        return '';
    }
  }
}

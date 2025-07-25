// farmer-loan-report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FarmerLoanService } from '../../../../../Services/farmer-loan.service';
import { FarmerLoan } from '../../../../../models/farmer-loan.interface';

@Component({
  selector: 'app-farmer-loan-report',
  templateUrl: './farmer-loan-report.component.html',
  styleUrls: ['./farmer-loan-report.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FarmerLoanReportComponent implements OnInit {
  selectedFarmerId = 'All Farmers';
  selectedLoanStatus = 'All Statuses';
  selectedStartDate = '';
  selectedEndDate = '';

  farmerLoans: FarmerLoan[] = [];
  filteredLoans: FarmerLoan[] = [];
  farmerIds: string[] = [];
  loanStatuses = ['Active', 'Paid Off', 'Defaulted'];
  
  totalLoanAmount: number = 0;
  totalOutstandingBalance: number = 0;
  totalRepayments: number = 0;
  totalIncentives: number = 0;

  showEditModal = false;
  editingLoan: FarmerLoan | null = null;

  constructor(private farmerLoanService: FarmerLoanService) {}

  ngOnInit(): void {
    this.loadFarmerLoans();
  }

  loadFarmerLoans(): void {
    this.farmerLoanService.getFarmerLoans().subscribe({
      next: (data: FarmerLoan[]) => {
        this.farmerLoans = data;
        this.updateFarmerIds();
        this.filterLoans();
      },
      error: (error: unknown) => {
        console.error('Error loading farmer loans:', error);
        if (typeof window !== 'undefined') {
          alert('Failed to load farmer loans. Please try again.');
        }
      }
    });
  }

  updateFarmerIds(): void {
    const uniqueIds = [...new Set(this.farmerLoans.map(loan => loan.farmerId.toString()))];
    this.farmerIds = uniqueIds.sort();
  }

  filterLoans(): void {
    this.filteredLoans = this.farmerLoans.filter(loan => {
      const matchesFarmerId = this.selectedFarmerId === 'All Farmers' || loan.farmerId.toString() === this.selectedFarmerId;
      const matchesLoanStatus = this.selectedLoanStatus === 'All Statuses' || loan.loanStatus === this.selectedLoanStatus;
      
      const loanDate = new Date(loan.loanDate);
      const startDate = this.selectedStartDate ? new Date(this.selectedStartDate) : null;
      const endDate = this.selectedEndDate ? new Date(this.selectedEndDate) : null;
      
      const matchesStartDate = !startDate || loanDate >= startDate;
      const matchesEndDate = !endDate || loanDate <= endDate;

      return matchesFarmerId && matchesLoanStatus && matchesStartDate && matchesEndDate;
    });

    this.updateSummary();
  }

  updateSummary(): void {
    this.totalLoanAmount = this.filteredLoans.reduce((sum, loan) => sum + loan.loanAmount, 0);
    this.totalOutstandingBalance = this.filteredLoans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
    this.totalRepayments = this.filteredLoans.reduce((sum, loan) => sum + loan.repayments, 0);
    this.totalIncentives = this.filteredLoans.reduce((sum, loan) => sum + loan.incentives, 0);
  }

  editLoan(loan: FarmerLoan): void {
    this.editingLoan = { ...loan };
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (!this.editingLoan) return;
    
    this.farmerLoanService.updateFarmerLoan(this.editingLoan).subscribe({
      next: () => {
        this.loadFarmerLoans();
        this.showEditModal = false;
        this.editingLoan = null;
      },
      error: (error: unknown) => {
        console.error('Error updating farmer loan:', error);
        if (typeof window !== 'undefined') {
          alert('Failed to update farmer loan. Please try again.');
        }
      }
    });
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingLoan = null;
  }

  confirmDelete(id: number): void {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this loan record?')) {
      this.deleteLoan(id);
    }
  }

  deleteLoan(id: number): void {
    this.farmerLoanService.deleteFarmerLoan(id).subscribe({
      next: () => {
        this.loadFarmerLoans();
      },
      error: (error: unknown) => {
        console.error('Error deleting farmer loan:', error);
        if (typeof window !== 'undefined') {
          alert('Failed to delete farmer loan. Please try again.');
        }
      }
    });
  }

  getLoanStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'active';
      case 'Paid Off': return 'paid-off';
      case 'Defaulted': return 'defaulted';
      default: return '';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }
}

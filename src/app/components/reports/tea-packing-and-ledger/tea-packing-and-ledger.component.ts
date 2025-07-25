import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeaPackingLedgerService, TeaPackingLedger } from '../../../Services/tea-packing-and-ledger.service';

@Component({
  selector: 'app-tea-packing-ledger',
  templateUrl: './tea-packing-and-ledger.component.html',
  styleUrls: ['./tea-packing-and-ledger.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TeaPackingLedgerComponent implements OnInit {
  selectedSaleID = 'All Sale IDs';
  selectedTransactionType = 'All Types';
  selectedStatus = 'All Statuses';
  selectedStartDate = '';
  selectedEndDate = '';

  records: TeaPackingLedger[] = [];
  filteredRecords: TeaPackingLedger[] = [];
  totalKilos: number = 0;
  totalSales: number = 0;
  totalCashSales: number = 0;
  totalCardSales: number = 0;

  showEditModal = false;
  editingRecord: TeaPackingLedger | null = null;

  constructor(private ledgerService: TeaPackingLedgerService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.ledgerService.getLedgers().subscribe({
      next: (data) => {
        this.records = data;
        this.filterRecords();
      },
      error: (error) => {
        console.error('Error loading records:', error);
      }
    });
  }

  filterRecords(): void {
    this.filteredRecords = this.records.filter(record => {
      const matchesSaleID = this.selectedSaleID === 'All Sale IDs' || record.saleId === this.selectedSaleID;
      const matchesTransactionType = this.selectedTransactionType === 'All Types' || record.transactionType === this.selectedTransactionType;
      const matchesStatus = this.selectedStatus === 'All Statuses' || record.status === this.selectedStatus;
      
      const recordDate = new Date(record.saleDate);
      const startDate = this.selectedStartDate ? new Date(this.selectedStartDate) : null;
      const endDate = this.selectedEndDate ? new Date(this.selectedEndDate) : null;
      
      const matchesStartDate = !startDate || recordDate >= startDate;
      const matchesEndDate = !endDate || recordDate <= endDate;

      return matchesSaleID && matchesTransactionType && matchesStatus && matchesStartDate && matchesEndDate;
    });

    this.updateSummary();
  }

  updateSummary(): void {
    this.totalKilos = this.filteredRecords.reduce((sum, record) => sum + record.kilosSold, 0);
    this.totalSales = this.filteredRecords.length;
    this.totalCashSales = this.filteredRecords.filter(record => record.transactionType === 'Cash').length;
    this.totalCardSales = this.filteredRecords.filter(record => record.transactionType === 'Card').length;
  }

  editRecord(record: TeaPackingLedger): void {
    this.editingRecord = { ...record };
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (this.editingRecord) {
      this.ledgerService.updateLedger(this.editingRecord).subscribe({
        next: () => {
          this.loadRecords();
          this.showEditModal = false;
          this.editingRecord = null;
        },
        error: (error) => {
          console.error('Error updating record:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingRecord = null;
  }

  confirmDelete(saleId: string): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.deleteRecord(saleId);
    }
  }

  deleteRecord(saleId: string): void {
    this.ledgerService.deleteLedger(saleId).subscribe({
      next: () => {
        this.loadRecords();
      },
      error: (error) => {
        console.error('Error deleting record:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
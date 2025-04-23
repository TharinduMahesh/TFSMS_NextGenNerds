import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LedgerRecord {
  saleId: string;
  buyerName: string;
  kilosSold: number;
  soldPriceKg: number;
  transactionType: string;
  saleDate: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

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

  records: LedgerRecord[] = [
    { saleId: 'S-001', buyerName: 'Ajith', kilosSold: 500, soldPriceKg: 300, transactionType: 'Cash', saleDate: '2024-12-17', status: 'Completed' },
    { saleId: 'S-002', buyerName: 'Samantha', kilosSold: 0, soldPriceKg: 0, transactionType: 'Cash', saleDate: '2024-12-17', status: 'Pending' },
    { saleId: 'S-003', buyerName: 'Amara', kilosSold: 400, soldPriceKg: 212, transactionType: 'Card', saleDate: '2024-12-17', status: 'Completed' }
  ];

  filteredRecords: LedgerRecord[] = [];
  totalKilos: number = 0;
  totalSales: number = 0;
  totalCashSales: number = 0;
  totalCardSales: number = 0;

  ngOnInit(): void {
    this.filterRecords();
  }

  filterRecords(): void {
    this.filteredRecords = this.records.filter(record => {
      const matchesSaleID = this.selectedSaleID === 'All Sale IDs' || record.saleId === this.selectedSaleID;
      const matchesTransactionType = this.selectedTransactionType === 'All Types' || record.transactionType === this.selectedTransactionType;
      const matchesStatus = this.selectedStatus === 'All Statuses' || record.status === this.selectedStatus;
      const matchesStartDate = !this.selectedStartDate || new Date(record.saleDate) >= new Date(this.selectedStartDate);
      const matchesEndDate = !this.selectedEndDate || new Date(record.saleDate) <= new Date(this.selectedEndDate);

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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Pending':
        return 'pending';
      case 'Cancelled':
        return 'cancelled';
      default:
        return '';
    }
  }
}

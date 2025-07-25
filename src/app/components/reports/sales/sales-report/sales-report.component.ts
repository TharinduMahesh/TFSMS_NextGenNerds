// src/app/components/reports/sales-report/sales-report.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from "../../../../components/header/header.component";
import { SalesReportService } from '../../../../Services/sales-report.service'; // Import the new service
import { SalesEntry } from '../../../../models/sales-entry.interface'; // Import the SalesEntry interface

// Define interfaces for Summary KPIs (optional, but good for reports)
interface SalesSummaryKpi {
  totalSalesEntries: number;
  totalQuantitySold: number;
  totalRevenue: number;
  averageUnitPrice: number;
  topTeaGrade: string | null;
}

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  // --- Report Filter Properties ---
  startDate: string = '2023-01-01'; // Default to a wide historical range
  endDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  customerNameFilter: string = '';
  teaGradeFilter: string = '';

  // --- Report Data Properties ---
  allSalesRecords: SalesEntry[] = []; // Stores all fetched sales entries
  filteredSalesRecords: SalesEntry[] = []; // Stores sales entries after applying filters

  // --- Summary KPIs ---
  summary: SalesSummaryKpi = {
    totalSalesEntries: 0,
    totalQuantitySold: 0,
    totalRevenue: 0,
    averageUnitPrice: 0,
    topTeaGrade: null,
  };

  public isBrowser: boolean; // To check if running in browser environment

  constructor(
    private router: Router,
    private salesReportService: SalesReportService, // Inject the Sales Report Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Load sales report data when the component initializes
    this.loadSalesRecords();
  }

  /**
   * @method loadSalesRecords
   * @description Fetches sales entries data from the backend using the SalesReportService.
   * Applies filters after data is loaded.
   */
  loadSalesRecords(): void {
    this.salesReportService.getSalesEntries(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.allSalesRecords = data.map(entry => ({
          ...entry,
          saleDate: new Date(entry.saleDate).toISOString().split('T')[0] // Ensure YYYY-MM-DD for consistency
        })).sort((a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime()); // Sort by date ascending

        console.log('Sales records loaded:', this.allSalesRecords);
        this.applyFilters(); // Apply filters to display data and update KPIs
      },
      error: (error) => {
        console.error('Error loading sales report:', error);
        if (this.isBrowser) {
          alert('Failed to load sales report. Please check backend connections.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies client-side filters to the sales report data.
   * Updates `filteredSalesRecords` and recalculates KPIs.
   */
  applyFilters(): void {
    let tempRecords = [...this.allSalesRecords];

    // Filter by Customer Name
    if (this.customerNameFilter) {
      tempRecords = tempRecords.filter(record =>
        record.customerName.toLowerCase().includes(this.customerNameFilter.toLowerCase())
      );
    }

    // Filter by Tea Grade
    if (this.teaGradeFilter) {
      tempRecords = tempRecords.filter(record =>
        record.teaGrade.toLowerCase().includes(this.teaGradeFilter.toLowerCase())
      );
    }

    this.filteredSalesRecords = tempRecords;
    this.calculateSummaryKpis();
    // If you add charts, you'd call updateChartData() here
  }

  /**
   * @method clearFilters
   * @description Resets all filters to their default values and reloads the report.
   */
  clearFilters(): void {
    this.startDate = '2023-01-01';
    this.endDate = new Date().toISOString().split('T')[0];
    this.customerNameFilter = '';
    this.teaGradeFilter = '';
    this.loadSalesRecords(); // Reload data with cleared filters
  }

  /**
   * @method calculateSummaryKpis
   * @description Calculates and updates the summary KPIs based on `filteredSalesRecords`.
   */
  calculateSummaryKpis(): void {
    this.summary.totalSalesEntries = this.filteredSalesRecords.length;
    this.summary.totalQuantitySold = this.filteredSalesRecords.reduce((sum, entry) => sum + entry.quantityKg, 0);
    this.summary.totalRevenue = this.filteredSalesRecords.reduce((sum, entry) => sum + entry.totalAmount, 0);
    this.summary.averageUnitPrice = this.summary.totalQuantitySold > 0 ?
      parseFloat((this.summary.totalRevenue / this.summary.totalQuantitySold).toFixed(2)) : 0;

    // Calculate Top Tea Grade
    const teaGradeCounts: { [key: string]: number } = {};
    this.filteredSalesRecords.forEach(entry => {
      teaGradeCounts[entry.teaGrade] = (teaGradeCounts[entry.teaGrade] || 0) + entry.quantityKg; // Sum quantity per grade
    });

    let topGrade: string | null = null;
    let maxQuantity = 0;
    for (const grade in teaGradeCounts) {
      if (teaGradeCounts[grade] > maxQuantity) {
        maxQuantity = teaGradeCounts[grade];
        topGrade = grade;
      }
    }
    this.summary.topTeaGrade = topGrade;
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
   * @method exportToCsv
   * @description Exports the currently filtered sales report data to a CSV file.
   */
  exportToCsv(): void {
    if (this.filteredSalesRecords.length === 0) {
      if (this.isBrowser) {
        alert('No data to export.');
      }
      return;
    }

    const headers = [
      'ID', 'Invoice Number', 'Sale Date', 'Customer Name',
      'Tea Grade', 'Quantity (Kg)', 'Unit Price (Kg)', 'Total Amount', 'Remarks'
    ];

    const csvRows = this.filteredSalesRecords.map(record => {
      const escapeCsv = (value: any): string => {
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      return [
        escapeCsv(record.id),
        escapeCsv(record.invoiceNumber),
        escapeCsv(this.formatDate(record.saleDate)),
        escapeCsv(record.customerName),
        escapeCsv(record.teaGrade),
        escapeCsv(record.quantityKg),
        escapeCsv(record.unitPriceKg),
        escapeCsv(record.totalAmount),
        escapeCsv(record.remarks || 'N/A')
      ].join(',');
    });

    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    if (this.isBrowser) {
      const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.warn('CSV export is not supported in server-side rendering.');
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

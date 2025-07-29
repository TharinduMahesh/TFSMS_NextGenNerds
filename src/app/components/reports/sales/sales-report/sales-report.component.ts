// src/app/components/reports/sales-report/sales-report.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from "../../../../components/header/header.component"; // Import HeaderComponent
import { SidebarComponent } from '../../../sidebar/sidebar/sidebar.component'; // Import SidebarComponent

import { SalesReportService } from '../../../../Services/sales-report.service'; // Keep this for now, but will transition to InvoiceService
import { InvoiceService } from '../../../../Services/invoice.service'; // NEW: Import InvoiceService
import { SalesEntry } from '../../../../models/sales-entry.interface'; // Import the SalesEntry interface (for line items)
import { Invoice } from '../../../../models/invoice.interface'; // NEW: Import Invoice interface

// Define interfaces for Summary KPIs (optional, but good for reports)
interface SalesSummaryKpi {
  totalSalesEntries: number; // Number of invoices
  totalQuantitySold: number; // Total quantity from all invoice line items
  totalRevenue: number; // Total amount from all invoices
  averageUnitPrice: number; // Calculated
  topTeaGrade: string | null;
}

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent], // Added HeaderComponent to imports
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  // --- Report Filter Properties ---
  startDate: string = '2023-01-01'; // Default to a wide historical range
  endDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  customerNameFilter: string = ''; // Will filter by BrokerName/BuyerName
  teaGradeFilter: string = ''; // Will filter by TeaGrade in line items

  // --- Report Data Properties ---
  allInvoiceRecords: Invoice[] = []; // NEW: Stores all fetched invoices
  filteredInvoiceRecords: Invoice[] = []; // NEW: Stores invoices after applying filters

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
    private salesReportService: SalesReportService, // Keep for now if other reports use it
    private invoiceService: InvoiceService, // NEW: Inject InvoiceService
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Load sales report data (now from Invoices) when the component initializes
    this.loadSalesRecords();
  }

  /**
   * @method loadSalesRecords
   * @description Fetches invoice records from the backend using the InvoiceService.
   * Applies filters after data is loaded.
   */
  loadSalesRecords(): void {
    // NEW: Fetch data from InvoiceService
    this.invoiceService.getInvoices(
      undefined, // No status filter initially
      undefined, // No invoice number filter initially
      this.startDate,
      this.endDate
    ).subscribe({
      next: (data) => {
        this.allInvoiceRecords = data.map(entry => ({
          ...entry,
          invoiceDate: entry.invoiceDate ? new Date(entry.invoiceDate).toISOString().split('T')[0] : '', // Ensure YYYY-MM-DD
          createdAt: entry.createdAt || null,
          updatedAt: entry.updatedAt || null
        })).sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()); // Sort by date descending

        console.log('Invoice records loaded for Sales Report:', this.allInvoiceRecords);
        this.applyFilters(); // Apply filters to display data and update KPIs
      },
      error: (error) => {
        console.error('Error loading sales report (from invoices):', error);
        if (this.isBrowser) {
          alert('Failed to load sales report. Please check backend connections.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies client-side filters to the invoice data.
   * Updates `filteredInvoiceRecords` and recalculates KPIs.
   */
  applyFilters(): void {
    let tempRecords = [...this.allInvoiceRecords];

    // Filter by Customer Name (BrokerName or BuyerName)
    if (this.customerNameFilter) {
      tempRecords = tempRecords.filter(record =>
        (record.brokerName?.toLowerCase().includes(this.customerNameFilter.toLowerCase()) ||
         record.buyerName?.toLowerCase().includes(this.customerNameFilter.toLowerCase()))
      );
    }

    // Filter by Tea Grade (from SalesEntries line items)
    if (this.teaGradeFilter) {
      tempRecords = tempRecords.filter(invoice =>
        invoice.salesEntries?.some(se => se.teaGrade.toLowerCase().includes(this.teaGradeFilter.toLowerCase()))
      );
    }

    this.filteredInvoiceRecords = tempRecords;
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
   * @description Calculates and updates the summary KPIs based on `filteredInvoiceRecords`.
   */
  calculateSummaryKpis(): void {
    this.summary.totalSalesEntries = this.filteredInvoiceRecords.length; // Number of invoices

    // Calculate total quantity sold and total revenue from invoice line items
    let totalKilos = 0;
    let totalRevenue = 0;
    this.filteredInvoiceRecords.forEach(invoice => {
      invoice.salesEntries?.forEach(lineItem => {
        totalKilos += lineItem.quantityKg;
        totalRevenue += lineItem.totalAmount;
      });
    });

    this.summary.totalQuantitySold = totalKilos;
    this.summary.totalRevenue = totalRevenue;

    this.summary.averageUnitPrice = totalKilos > 0 ?
      parseFloat((totalRevenue / totalKilos).toFixed(2)) : 0;

    // Calculate Top Tea Grade
    const teaGradeCounts: { [key: string]: number } = {};
    this.filteredInvoiceRecords.forEach(invoice => {
      invoice.salesEntries?.forEach(lineItem => {
        teaGradeCounts[lineItem.teaGrade] = (teaGradeCounts[lineItem.teaGrade] || 0) + lineItem.quantityKg;
      });
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
  formatDate(dateString: string | undefined | null): string {
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
    if (this.filteredInvoiceRecords.length === 0) {
      if (this.isBrowser) {
        alert('No data to export.');
      }
      return;
    }

    const headers = [
      'Invoice ID', 'Invoice Number', 'Invoice Date', 'Broker Name', 'Buyer Name',
      'Total Amount (Rs.)', 'Sold Price Per Kg', 'Status', 'Tea Grade (Line Item)', 'Quantity (Line Item)'
    ];

    const csvRows = this.filteredInvoiceRecords.flatMap(invoice => {
      // For each invoice, create a row for each sales entry (line item)
      if (invoice.salesEntries && invoice.salesEntries.length > 0) {
        return invoice.salesEntries.map(lineItem => {
          const escapeCsv = (value: any): string => {
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          };

          return [
            escapeCsv(invoice.invoiceId),
            escapeCsv(invoice.invoiceNumber),
            escapeCsv(this.formatDate(invoice.invoiceDate)),
            escapeCsv(invoice.brokerName),
            escapeCsv(invoice.buyerName || 'N/A'),
            escapeCsv(invoice.totalAmount),
            escapeCsv(invoice.soldPricePerKg),
            escapeCsv(invoice.status),
            escapeCsv(lineItem.teaGrade),
            escapeCsv(lineItem.quantityKg)
          ].join(',');
        });
      } else {
        // If no sales entries, still include the invoice header
        const escapeCsv = (value: any): string => {
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        };
        return [
          escapeCsv(invoice.invoiceId),
          escapeCsv(invoice.invoiceNumber),
          escapeCsv(this.formatDate(invoice.invoiceDate)),
          escapeCsv(invoice.brokerName),
          escapeCsv(invoice.buyerName || 'N/A'),
          escapeCsv(invoice.totalAmount),
          escapeCsv(invoice.soldPricePerKg),
          escapeCsv(invoice.status),
          '', // No tea grade
          ''  // No quantity
        ].join(',');
      }
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

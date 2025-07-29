// src/app/components/reports/sales-charge-report/sales-charge-report.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from '../../../header/header.component'; // Import HeaderComponent for navigation
import { SidebarComponent } from '../../../sidebar/sidebar/sidebar.component';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

import { SalesChargeReportService } from '../../../../Services/sales-charge-report.service'; // Import the new service
import { SalesCharge } from '../../../../models/sales-charge.interface'; // Import the SalesCharge interface

// Define interfaces for Summary KPIs (optional, but good for reports)
interface SalesChargeSummaryKpi {
  totalCharges: number;
  totalAmount: number;
  topChargeType: string | null;
}

@Component({
  selector: 'app-sales-charge-report',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, HeaderComponent, SidebarComponent],
  templateUrl: './sales-charge-report.component.html',
  styleUrls: ['./sales-charge-report.component.css']
})
export class SalesChargeReportComponent implements OnInit {

  // --- Report Filter Properties ---
  startDate: string = '2023-01-01'; // Default to a wide historical range
  endDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  chargeTypeFilter: string = '';
  saleReferenceFilter: string = '';

  // --- Report Data Properties ---
  allSalesChargeRecords: SalesCharge[] = []; // Stores all fetched sales charge entries
  filteredSalesChargeRecords: SalesCharge[] = []; // Stores sales charge entries after applying filters

  // --- Summary KPIs ---
  summary: SalesChargeSummaryKpi = {
    totalCharges: 0,
    totalAmount: 0,
    topChargeType: null,
  };

  public isBrowser: boolean; // To check if running in browser environment

  /* --- Chart Configurations --- */

  // 1. Sales Charge Amount Trend (Line Chart)
  public chargeAmountTrendChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Charge Amount (Rs.)',
        borderColor: 'rgba(255, 99, 132, 1)', // Reddish color
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#FF6384',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      }
    ],
    labels: []
  };
  public chargeAmountTrendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'Total Amount (Rs.)' }, beginAtZero: true }
    }
  };
  public chargeAmountTrendChartType: ChartType = 'line';

  // 2. Sales Charges by Type (Bar Chart)
  public chargesByTypeChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Total Amount (Rs.)',
        backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#FF6384'],
        borderColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#FF6384'],
        borderWidth: 1
      }
    ],
    labels: []
  };
  public chargesByTypeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Charge Type' } },
      y: { display: true, title: { display: true, text: 'Total Amount (Rs.)' }, beginAtZero: true }
    }
  };
  public chargesByTypeChartType: ChartType = 'bar';

  // 3. Sales Charges Count by Type (Doughnut Chart)
  public chargesCountByTypeChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB']
      }
    ],
    labels: []
  };
  public chargesCountByTypeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: { enabled: true }
    }
  };
  public chargesCountByTypeChartType: ChartType = 'doughnut';


  constructor(
    private router: Router,
    private salesChargeReportService: SalesChargeReportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadSalesChargeRecords();
  }

  /**
   * @method loadSalesChargeRecords
   * @description Fetches sales charge entries data from the backend using the SalesChargeReportService.
   * Applies filters after data is loaded.
   */
  loadSalesChargeRecords(): void {
    this.salesChargeReportService.getSalesCharges(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.allSalesChargeRecords = data.map(entry => ({
          ...entry,
          chargeDate: entry.chargeDate ? new Date(entry.chargeDate).toISOString().split('T')[0] : null,
          // saleReference: entry.saleReference || null,
          description: entry.description || null
        })).sort((a, b) => (b.salesChargeId || 0) - (a.salesChargeId || 0));

        console.log('Sales Charge records loaded:', this.allSalesChargeRecords);
        this.applyFilters(); // Apply filters to display data and update KPIs
      },
      error: (error) => {
        console.error('Error loading sales charge report:', error);
        if (this.isBrowser) {
          alert('Failed to load sales charge report. Please check backend connections.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies client-side filters to the sales charge report data.
   * Updates `filteredSalesChargeRecords` and recalculates KPIs.
   */
  applyFilters(): void {
    let tempRecords = [...this.allSalesChargeRecords];

    // Filter by Charge Type
    if (this.chargeTypeFilter) {
      tempRecords = tempRecords.filter(record =>
        record.chargeType.toLowerCase().includes(this.chargeTypeFilter.toLowerCase())
      );
    }

    // FIX: Robust filter for optional saleReference (using &&)
    // if (this.saleReferenceFilter) {
    //   tempRecords = tempRecords.filter(record =>
    //     record.saleReference && record.saleReference.toLowerCase().includes(this.saleReferenceFilter.toLowerCase())
    //   );
    // }

    this.filteredSalesChargeRecords = tempRecords;
    this.calculateSummaryKpis();
    if (this.isBrowser) {
      this.updateChartData(); // Call updateChartData after filtering
    }
  }

  /**
   * @method clearFilters
   * @description Resets all filters to their default values and reloads the report.
   */
  clearFilters(): void {
    this.startDate = '2023-01-01';
    this.endDate = new Date().toISOString().split('T')[0];
    this.chargeTypeFilter = '';
    this.saleReferenceFilter = '';
    this.loadSalesChargeRecords(); // Reload data with cleared filters
  }

  /**
   * @method calculateSummaryKpis
   * @description Calculates and updates the summary KPIs based on `filteredSalesChargeRecords`.
   */
  calculateSummaryKpis(): void {
    this.summary.totalCharges = this.filteredSalesChargeRecords.length;
    this.summary.totalAmount = this.filteredSalesChargeRecords.reduce((sum, entry) => sum + entry.amount, 0);

    // Calculate Top Charge Type
    const chargeTypeAmounts: { [key: string]: number } = {}; // Sum amounts per type
    this.filteredSalesChargeRecords.forEach(entry => {
      chargeTypeAmounts[entry.chargeType] = (chargeTypeAmounts[entry.chargeType] || 0) + entry.amount;
    });

    let topType: string | null = null;
    let maxAmount = 0;
    for (const type in chargeTypeAmounts) {
      if (chargeTypeAmounts[type] > maxAmount) {
        maxAmount = chargeTypeAmounts[type];
        topType = type;
      }
    }
    this.summary.topChargeType = topType;
  }

  /**
   * @method updateChartData
   * @description Processes data and updates chart configurations.
   */
  private updateChartData(): void {
    // 1. Sales Charge Amount Trend (Line Chart)
    const monthlyChargeAmounts: { [key: string]: number } = {};
    this.filteredSalesChargeRecords.forEach(entry => {
      // FIX: Use optional chaining and nullish coalescing for chargeDate
      const month = entry.chargeDate ? new Date(entry.chargeDate).toISOString().substring(0, 7) : 'N/A';
      monthlyChargeAmounts[month] = (monthlyChargeAmounts[month] || 0) + entry.amount;
    });
    const sortedMonths = Object.keys(monthlyChargeAmounts).sort();
    const chargeAmounts = sortedMonths.map(month => monthlyChargeAmounts[month]);

    this.chargeAmountTrendChartData.labels = [...sortedMonths];
    this.chargeAmountTrendChartData.datasets = [{ ...this.chargeAmountTrendChartData.datasets[0], data: chargeAmounts }];

    // 2. Sales Charges by Type (Bar Chart)
    const chargesByTypeAmounts: { [key: string]: number } = {};
    this.filteredSalesChargeRecords.forEach(entry => {
      chargesByTypeAmounts[entry.chargeType] = (chargesByTypeAmounts[entry.chargeType] || 0) + entry.amount;
    });
    const sortedChargeTypesByAmount = Object.keys(chargesByTypeAmounts).sort();
    const amountsByType = sortedChargeTypesByAmount.map(type => chargesByTypeAmounts[type]);

    this.chargesByTypeChartData.labels = [...sortedChargeTypesByAmount];
    this.chargesByTypeChartData.datasets = [{ ...this.chargesByTypeChartData.datasets[0], data: amountsByType }];

    // 3. Sales Charges Count by Type (Doughnut Chart)
    const chargesCountByType: { [key: string]: number } = {};
    this.filteredSalesChargeRecords.forEach(entry => {
      chargesCountByType[entry.chargeType] = (chargesCountByType[entry.chargeType] || 0) + 1; // Count entries per type
    });
    const sortedChargeTypesByCount = Object.keys(chargesCountByType).sort();
    const countsByType = sortedChargeTypesByCount.map(type => chargesCountByType[type]);

    this.chargesCountByTypeChartData.labels = [...sortedChargeTypesByCount];
    this.chargesCountByTypeChartData.datasets = [{ ...this.chargesCountByTypeChartData.datasets[0], data: countsByType }];
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
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  /**
   * @method exportToCsv
   * @description Exports the currently filtered sales charge report data to a CSV file.
   */
  exportToCsv(): void {
    if (this.filteredSalesChargeRecords.length === 0) {
      if (this.isBrowser) {
        alert('No data to export.');
      }
      return;
    }

    const headers = [
      'ID', 'Sale Reference', 'Charge Type', 'Amount',
      'Charge Date', 'Description'
    ];

    const csvRows = this.filteredSalesChargeRecords.map(record => {
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
        escapeCsv(record.salesChargeId),
        // escapeCsv(record.saleReference || 'N/A'), // DEFINITIVE FIX: Handle optional saleReference for CSV
        escapeCsv(record.chargeType),
        escapeCsv(record.amount),
        escapeCsv(this.formatDate(record.chargeDate)), // DEFINITIVE FIX: Handle optional chargeDate for CSV
        escapeCsv(record.description || 'N/A')
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
      link.setAttribute('download', `sales_charge_report_${new Date().toISOString().split('T')[0]}.csv`);
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

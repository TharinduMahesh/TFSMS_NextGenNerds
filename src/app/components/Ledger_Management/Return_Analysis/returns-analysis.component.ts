import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
1
import { ChartConfiguration, ChartType } from 'chart.js';

import { ReturnsDataService } from '../../../Services/returns-data.service';
import { ReturnEntry } from '../../../models/return-analysis.interface'

interface SummaryKpi {
  totalReturns: number;
  totalKilosReturned: number;
  averageKilosPerReturn: number;
  topReturnReason: string | null;
  totalUniqueInvoices: number;
}

@Component({
  selector: 'app-returns-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './returns-analysis.component.html',
  styleUrls: ['./returns-analysis.component.css']
})
export class ReturnsAnalysisComponent implements OnInit {
  allReturnEntries: ReturnEntry[] = [];
  filteredReturns: ReturnEntry[] = [];

  // FIX: Initialize startDate and endDate to a wider range to include historical data
  startDate: string = '2023-01-01'; // Start from an early year to capture all sample data
  endDate: string = new Date().toISOString().split('T')[0]; // End at today's date

  returnReasonFilter: string = '';
  seasonFilter: string = '';
  gardenMarkFilter: string = '';

  summary: SummaryKpi = {
    totalReturns: 0,
    totalKilosReturned: 0,
    averageKilosPerReturn: 0,
    topReturnReason: null,
    totalUniqueInvoices: 0
  };

  public isBrowser: boolean;

  /* --- Chart Configurations (unchanged) --- */
  public lineChartData: ChartConfiguration['data'] = { datasets: [{ data: [], label: 'Returns Volume', borderColor: 'rgba(255,159,64,1)', backgroundColor: 'rgba(255,159,64,0.2)', fill: true, tension: 0.3, pointBackgroundColor: '#FF9900', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(255,159,64,1)' }], labels: [] };
  public lineChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' }, tooltip: { enabled: true } }, scales: { x: { display: true, title: { display: true, text: 'Month' } }, y: { display: true, title: { display: true, text: 'Number of Returns' }, beginAtZero: true } } };
  public lineChartType: ChartType = 'line';

  public reasonBarChartData: ChartConfiguration['data'] = { datasets: [{ data: [], label: 'Number of Returns', backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF'], borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF'], borderWidth: 1 }], labels: [] };
  public reasonBarChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { x: { display: true, title: { display: true, text: 'Return Reason' } }, y: { display: true, title: { display: true, text: 'Number of Returns' }, beginAtZero: true } } };
  public reasonBarChartType: ChartType = 'bar';

  public quantityReasonBarChartData: ChartConfiguration['data'] = { datasets: [{ data: [], label: 'Quantity Returned (Kg)', backgroundColor: ['#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB', '#FFCE56', '#C9CBCF'], borderColor: ['#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB', '#FFCE56', '#C9CBCF'], borderWidth: 1 }], labels: [] };
  public quantityReasonBarChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { x: { display: true, title: { display: true, text: 'Return Reason' } }, y: { display: true, title: { display: true, text: 'Total Quantity (Kg)' }, beginAtZero: true } } };
  public quantityReasonBarChartType: ChartType = 'bar';

  public gardenMarkBarChartData: ChartConfiguration['data'] = { datasets: [{ data: [], label: 'Number of Returns', backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF'], borderColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF'], borderWidth: 1 }], labels: [] };
  public gardenMarkBarChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { x: { display: true, title: { display: true, text: 'Garden Mark' } }, y: { display: true, title: { display: true, text: 'Number of Returns' }, beginAtZero: true } } };
  public gardenMarkBarChartType: ChartType = 'bar';

  public seasonBarChartData: ChartConfiguration['data'] = { datasets: [{ data: [], label: 'Number of Returns', backgroundColor: ['#9966FF', '#FF9900', '#C9CBCF', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], borderColor: ['#9966FF', '#FF9900', '#C9CBCF', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], borderWidth: 1 }], labels: [] };
  public seasonBarChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { x: { display: true, title: { display: true, text: 'Season' } }, y: { display: true, title: { display: true, text: 'Number of Returns' }, beginAtZero: true } } };
  public seasonBarChartType: ChartType = 'bar';


  constructor(
    private router: Router,
    private returnsDataService: ReturnsDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadReturnsData();

    // Removed the problematic initialization of startDate and endDate to current month here.
    // The component's property initialization (above) now handles the default range.
  }

  /**
   * Fetches return entries data from the backend API using the ReturnsDataService.
   */
  loadReturnsData(): void {
    this.returnsDataService.getReturns().subscribe({
      next: (returns: ReturnEntry[]) => {
        this.allReturnEntries = returns.map(r => ({
          ...r,
          returnDate: r.returnDate ? new Date(r.returnDate).toISOString().split('T')[0] : '',
          createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ''
        })).sort((a: ReturnEntry, b: ReturnEntry) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime());

        console.log('All Return Entries:', this.allReturnEntries);
        this.applyFilters(); // This will now apply filters to the full dataset with the wide default range
      },
      error: (error) => {
        console.error('Error loading returns data:', error);
        if (isPlatformBrowser(this.platformId)) {
          alert('Failed to load returns data. Please check backend connections.');
        }
      }
    });
  }

  /**
   * Applies filters based on selected criteria (date range, reason, season, garden mark).
   * Updates `filteredReturns` and recalculates KPIs and chart data.
   */
  applyFilters(): void {
    let tempReturns = [...this.allReturnEntries];

    // The component's property initialization now sets a default wide date range.
    // This block is now primarily for when the user actively changes the date filters.
    if (this.startDate) {
      tempReturns = tempReturns.filter(ret => new Date(ret.returnDate) >= new Date(this.startDate));
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setDate(end.getDate() + 1); // Include the end date in the filter
      tempReturns = tempReturns.filter(ret => new Date(ret.returnDate) < end);
    }

    // Filter by Return Reason
    if (this.returnReasonFilter) {
      tempReturns = tempReturns.filter(ret => ret.reason === this.returnReasonFilter);
    }

    // Filter by Season
    if (this.seasonFilter) {
      tempReturns = tempReturns.filter(ret => ret.season === this.seasonFilter);
    }

    // Filter by Garden Mark
    if (this.gardenMarkFilter) {
      tempReturns = tempReturns.filter(ret => ret.gardenMark.toLowerCase().includes(this.gardenMarkFilter.toLowerCase()));
    }

    this.filteredReturns = tempReturns;
    this.calculateSummaryKpis();
    if (isPlatformBrowser(this.platformId)) {
      this.updateChartData();
    }
  }

  /**
   * Clears all filter selections and re-applies filters to show all data for the current month.
   */
  clearFilters(): void {
    // FIX: When clearing filters, set them back to the wide default range
    this.startDate = '2023-01-01';
    this.endDate = new Date().toISOString().split('T')[0];

    this.returnReasonFilter = '';
    this.seasonFilter = '';
    this.gardenMarkFilter = '';

    this.applyFilters();
  }

  /**
   * Calculates and updates the summary KPIs based on `filteredReturns`.
   */
  calculateSummaryKpis(): void {
    this.summary.totalReturns = this.filteredReturns.length;
    this.summary.totalKilosReturned = this.filteredReturns.reduce((sum, ret) => sum + ret.kilosReturned, 0);
    this.summary.averageKilosPerReturn = this.summary.totalReturns > 0 ?
      parseFloat((this.summary.totalKilosReturned / this.summary.totalReturns).toFixed(2)) : 0;

    const reasonCounts: { [key: string]: number } = {};
    const uniqueInvoices = new Set<string>();
    this.filteredReturns.forEach(ret => {
      reasonCounts[ret.reason] = (reasonCounts[ret.reason] || 0) + 1;
      uniqueInvoices.add(ret.invoiceNumber);
    });

    let topReason: string | null = null;
    let maxCount = 0;
    for (const reason in reasonCounts) {
      if (reasonCounts[reason] > maxCount) {
        maxCount = reasonCounts[reason];
        topReason = reason;
      }
    }
    this.summary.topReturnReason = topReason;
    this.summary.totalUniqueInvoices = uniqueInvoices.size;
  }

  /**
   * Updates the data for all charts based on `filteredReturns`.
   */
  private updateChartData(): void {
    // Chart 1: Return Volume Trend (Line Chart)
    const monthlyReturnCounts: { [key: string]: number } = {}; // Key: YYYY-MM
    this.filteredReturns.forEach(ret => {
      const month = ret.returnDate.substring(0, 7); // "YYYY-MM"
      monthlyReturnCounts[month] = (monthlyReturnCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyReturnCounts).sort();
    const returnVolumes = sortedMonths.map(month => monthlyReturnCounts[month]);

    this.lineChartData.labels = [...sortedMonths];
    this.lineChartData.datasets = [{ ...this.lineChartData.datasets[0], data: returnVolumes }];


    // Chart 2: Returns by Reason (Bar Chart)
    const reasonCounts: { [key: string]: number } = {};
    this.filteredReturns.forEach(ret => {
      reasonCounts[ret.reason] = (reasonCounts[ret.reason] || 0) + 1;
    });
    const sortedReasons = Object.keys(reasonCounts).sort();
    const reasonValues = sortedReasons.map(reason => reasonCounts[reason]);

    this.reasonBarChartData.labels = [...sortedReasons];
    this.reasonBarChartData.datasets = [{ ...this.reasonBarChartData.datasets[0], data: reasonValues }];


    // Chart 3: Quantity Returned by Reason (Bar Chart)
    const quantityByReason: { [key: string]: number } = {};
    this.filteredReturns.forEach(ret => {
      quantityByReason[ret.reason] = (quantityByReason[ret.reason] || 0) + ret.kilosReturned;
    });
    const sortedQuantityReasons = Object.keys(quantityByReason).sort();
    const quantityReasonValues = sortedQuantityReasons.map(reason => quantityByReason[reason]);

    this.quantityReasonBarChartData.labels = [...sortedQuantityReasons];
    this.quantityReasonBarChartData.datasets = [{ ...this.quantityReasonBarChartData.datasets[0], data: quantityReasonValues }];


    // Chart 4: Returns by Garden Mark (Bar Chart)
    const gardenMarkCounts: { [key: string]: number } = {};
    this.filteredReturns.forEach(ret => {
      gardenMarkCounts[ret.gardenMark] = (gardenMarkCounts[ret.gardenMark] || 0) + 1;
    });
    const sortedGardenMarks = Object.keys(gardenMarkCounts).sort();
    const gardenMarkValues = sortedGardenMarks.map(mark => gardenMarkCounts[mark]);

    this.gardenMarkBarChartData.labels = [...sortedGardenMarks];
    this.gardenMarkBarChartData.datasets = [{ ...this.gardenMarkBarChartData.datasets[0], data: gardenMarkValues }];


    // Chart 5: Returns by Season (Bar Chart)
    const seasonCounts: { [key: string]: number } = {};
    this.filteredReturns.forEach(ret => {
      seasonCounts[ret.season] = (seasonCounts[ret.season] || 0) + 1;
    });
    const sortedSeasons = Object.keys(seasonCounts).sort();
    const seasonValues = sortedSeasons.map(season => seasonCounts[season]);

    this.seasonBarChartData.labels = [...sortedSeasons];
    this.seasonBarChartData.datasets = [{ ...this.seasonBarChartData.datasets[0], data: seasonValues }];
  }

  /**
   * Navigates back to the ledger management page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }

  /**
   * Exports the currently filtered returns data to a CSV file.
   */
  exportToCsv(): void {
    if (this.filteredReturns.length === 0) {
      if (isPlatformBrowser(this.platformId)) {
        alert('No data to export.');
      }
      return;
    }

    // Define CSV headers based on your table columns
    const headers = [
      'Return ID', 'Season', 'Garden Mark', 'Invoice Number',
      'Return Date', 'Kilos Returned (Kg)', 'Reason', 'Created At'
    ];

    // Map your filteredReturns data to CSV rows
    const csvRows = this.filteredReturns.map(record => {
      // Helper function to escape values for CSV
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
        escapeCsv(record.season),
        escapeCsv(record.gardenMark),
        escapeCsv(record.invoiceNumber),
        escapeCsv(record.returnDate), // Already formatted YYYY-MM-DD
        escapeCsv(record.kilosReturned),
        escapeCsv(record.reason),
        escapeCsv(record.createdAt) // Already formatted
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    // Create a Blob from the CSV content and trigger download
    if (this.isBrowser) {
      const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `returns_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.warn('CSV export is not supported in server-side rendering.');
    }
  }
}

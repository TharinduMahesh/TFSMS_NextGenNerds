// src/app/components/reports/gratis-issue-report/gratis-issue-report.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from "../../../header/header.component";
import { SidebarComponent } from '../../../sidebar/sidebar/sidebar.component';

// NEW: Import for Charts
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

import { GratisIssueReportService } from '../../../../Services/gratis-issue-report.service'; // Import the new service
import { GratisIssue } from '../../../../models/gratis-issue.interface'; // Import the GratisIssue interface

// Define interfaces for Summary KPIs
interface GratisIssueSummaryKpi {
  totalIssues: number;
  totalQuantityIssued: number;
  topPurpose: string | null;
  topTeaGrade: string | null;
}

@Component({
  selector: 'app-gratis-issue-report',
  standalone: true,
  // NEW: Add BaseChartDirective to imports
  imports: [CommonModule, FormsModule, BaseChartDirective, HeaderComponent, SidebarComponent],
  templateUrl: './gratis-issue-report.component.html',
  styleUrls: ['./gratis-issue-report.component.css']
})
export class GratisIssueReportComponent implements OnInit {

  // --- Report Filter Properties ---
  startDate: string = '2023-01-01'; // Default to a wide historical range
  endDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  purposeFilter: string = '';
  teaGradeFilter: string = '';
  receiverFilter: string = '';

  // --- Report Data Properties ---
  allGratisIssueRecords: GratisIssue[] = []; // Stores all fetched gratis issue entries
  filteredGratisIssueRecords: GratisIssue[] = []; // Stores gratis issue entries after applying filters

  // --- Summary KPIs ---
  summary: GratisIssueSummaryKpi = {
    totalIssues: 0,
    totalQuantityIssued: 0,
    topPurpose: null,
    topTeaGrade: null,
  };

  public isBrowser: boolean; // To check if running in browser environment

  /* --- Chart Configurations --- */

  // 1. Gratis Issue Quantity Trend (Line Chart)
  public quantityTrendChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Quantity Issued (Kg)',
        borderColor: 'rgba(75, 192, 192, 1)', // Teal color
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#4BC0C0',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      }
    ],
    labels: []
  };
  public quantityTrendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'Total Quantity (Kg)' }, beginAtZero: true }
    }
  };
  public quantityTrendChartType: ChartType = 'line';

  // 2. Gratis Issues by Purpose (Bar Chart)
  public issuesByPurposeChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Number of Issues',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'],
        borderWidth: 1
      }
    ],
    labels: []
  };
  public issuesByPurposeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Purpose' } },
      y: { display: true, title: { display: true, text: 'Number of Issues' }, beginAtZero: true }
    }
  };
  public issuesByPurposeChartType: ChartType = 'bar';

  // 3. Quantity Issued by Tea Grade (Doughnut Chart)
  public quantityByTeaGradeChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB']
      }
    ],
    labels: []
  };
  public quantityByTeaGradeChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: { enabled: true }
    }
  };
  public quantityByTeaGradeChartType: ChartType = 'doughnut';


  constructor(
    private router: Router,
    private gratisIssueReportService: GratisIssueReportService, // Inject the Gratis Issue Report Service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadGratisIssueRecords();
  }

  /**
   * @method loadGratisIssueRecords
   * @description Fetches gratis issue entries data from the backend using the GratisIssueReportService.
   * Applies filters after data is loaded.
   */
  loadGratisIssueRecords(): void {
    this.gratisIssueReportService.getGratisIssues(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.allGratisIssueRecords = data.map(entry => ({
          ...entry,
          issueDate: new Date(entry.issueDate).toISOString().split('T')[0] // Ensure YYYY-MM-DD for consistency
        })).sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()); // Sort by date ascending

        console.log('Gratis Issue records loaded:', this.allGratisIssueRecords);
        this.applyFilters(); // Apply filters to display data and update KPIs/charts
      },
      error: (error) => {
        console.error('Error loading gratis issue report:', error);
        if (this.isBrowser) {
          alert('Failed to load gratis issue report. Please check backend connections.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies client-side filters to the gratis issue report data.
   * Updates `filteredGratisIssueRecords` and recalculates KPIs and chart data.
   */
  applyFilters(): void {
    let tempRecords = [...this.allGratisIssueRecords];

    // Filter by Purpose
    if (this.purposeFilter) {
      tempRecords = tempRecords.filter(record =>
        record.purpose.toLowerCase().includes(this.purposeFilter.toLowerCase())
      );
    }

    // Filter by Tea Grade
    if (this.teaGradeFilter) {
      tempRecords = tempRecords.filter(record =>
        record.teaGrade.toLowerCase().includes(this.teaGradeFilter.toLowerCase())
      );
    }

    // Filter by Receiver
    if (this.receiverFilter) {
      tempRecords = tempRecords.filter(record =>
        record.receiver.toLowerCase().includes(this.receiverFilter.toLowerCase())
      );
    }

    this.filteredGratisIssueRecords = tempRecords;
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
    this.purposeFilter = '';
    this.teaGradeFilter = '';
    this.receiverFilter = '';
    this.loadGratisIssueRecords(); // Reload data with cleared filters
  }

  /**
   * @method calculateSummaryKpis
   * @description Calculates and updates the summary KPIs based on `filteredGratisIssueRecords`.
   */
  calculateSummaryKpis(): void {
    this.summary.totalIssues = this.filteredGratisIssueRecords.length;
    this.summary.totalQuantityIssued = this.filteredGratisIssueRecords.reduce((sum, entry) => sum + entry.quantityKg, 0);

    // Calculate Top Purpose
    const purposeCounts: { [key: string]: number } = {};
    this.filteredGratisIssueRecords.forEach(entry => {
      purposeCounts[entry.purpose] = (purposeCounts[entry.purpose] || 0) + entry.quantityKg; // Sum quantity per purpose
    });

    let topPurpose: string | null = null;
    let maxQuantityPurpose = 0;
    for (const purpose in purposeCounts) {
      if (purposeCounts[purpose] > maxQuantityPurpose) {
        maxQuantityPurpose = purposeCounts[purpose];
        topPurpose = purpose;
      }
    }
    this.summary.topPurpose = topPurpose;

    // Calculate Top Tea Grade
    const teaGradeQuantities: { [key: string]: number } = {};
    this.filteredGratisIssueRecords.forEach(entry => {
      teaGradeQuantities[entry.teaGrade] = (teaGradeQuantities[entry.teaGrade] || 0) + entry.quantityKg;
    });

    let topTeaGrade: string | null = null;
    let maxQuantityTeaGrade = 0;
    for (const grade in teaGradeQuantities) {
      if (teaGradeQuantities[grade] > maxQuantityTeaGrade) {
        maxQuantityTeaGrade = teaGradeQuantities[grade];
        topTeaGrade = grade;
      }
    }
    this.summary.topTeaGrade = topTeaGrade;
  }

  /**
   * @method updateChartData
   * @description Processes data and updates chart configurations.
   */
  private updateChartData(): void {
    // 1. Gratis Issue Quantity Trend (Line Chart)
    const monthlyQuantities: { [key: string]: number } = {};
    this.filteredGratisIssueRecords.forEach(entry => {
      const month = new Date(entry.issueDate).toISOString().substring(0, 7); // YYYY-MM
      monthlyQuantities[month] = (monthlyQuantities[month] || 0) + entry.quantityKg;
    });
    const sortedMonths = Object.keys(monthlyQuantities).sort();
    const quantities = sortedMonths.map(month => monthlyQuantities[month]);

    this.quantityTrendChartData.labels = [...sortedMonths];
    this.quantityTrendChartData.datasets = [{ ...this.quantityTrendChartData.datasets[0], data: quantities }];

    // 2. Gratis Issues by Purpose (Bar Chart)
    const issuesByPurposeCounts: { [key: string]: number } = {};
    this.filteredGratisIssueRecords.forEach(entry => {
      issuesByPurposeCounts[entry.purpose] = (issuesByPurposeCounts[entry.purpose] || 0) + 1; // Count issues per purpose
    });
    const sortedPurposesByCount = Object.keys(issuesByPurposeCounts).sort();
    const countsByPurpose = sortedPurposesByCount.map(purpose => issuesByPurposeCounts[purpose]);

    this.issuesByPurposeChartData.labels = [...sortedPurposesByCount];
    this.issuesByPurposeChartData.datasets = [{ ...this.issuesByPurposeChartData.datasets[0], data: countsByPurpose }];

    // 3. Quantity Issued by Tea Grade (Doughnut Chart)
    const quantityByTeaGrade: { [key: string]: number } = {};
    this.filteredGratisIssueRecords.forEach(entry => {
      quantityByTeaGrade[entry.teaGrade] = (quantityByTeaGrade[entry.teaGrade] || 0) + entry.quantityKg;
    });
    const sortedTeaGradesByQuantity = Object.keys(quantityByTeaGrade).sort();
    const quantitiesByTeaGrade = sortedTeaGradesByQuantity.map(grade => quantityByTeaGrade[grade]);

    this.quantityByTeaGradeChartData.labels = [...sortedTeaGradesByQuantity];
    this.quantityByTeaGradeChartData.datasets = [{ ...this.quantityByTeaGradeChartData.datasets[0], data: quantitiesByTeaGrade }];
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
   * @description Exports the currently filtered gratis issue report data to a CSV file.
   */
  exportToCsv(): void {
    if (this.filteredGratisIssueRecords.length === 0) {
      if (this.isBrowser) {
        alert('No data to export.');
      }
      return;
    }

    const headers = [
      'ID', 'Issue Date', 'Purpose', 'Receiver',
      'Quantity (Kg)', 'Tea Grade', 'Batch/Lot No.', 'Reference No.', 'Remarks'
    ];

    const csvRows = this.filteredGratisIssueRecords.map(record => {
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
        escapeCsv(this.formatDate(record.issueDate)),
        escapeCsv(record.purpose),
        escapeCsv(record.receiver),
        escapeCsv(record.quantityKg),
        escapeCsv(record.teaGrade),
        escapeCsv(record.batchLotNumber || 'N/A'),
        escapeCsv(record.referenceMemo || 'N/A'),
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
      link.setAttribute('download', `gratis_issue_report_${new Date().toISOString().split('T')[0]}.csv`);
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

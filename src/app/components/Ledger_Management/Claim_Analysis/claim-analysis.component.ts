import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from "../../header/header.component";
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';

// Import services and interfaces for Claims
import { ClaimEntryService } from '../../../Services/claim-entry.service';
import { ClaimAdjustmentService } from '../../../Services/claim-adjustment.service';
import { ClaimEntry } from '../../../models/claim-entry.interface';
import { ClaimAdjustment } from '../../../models/claim-adjustment.interface';

// Temporary interface to combine ClaimEntry and ClaimAdjustment for analysis
interface CombinedClaimRecord {
  claimId: number;
  claimType: string;
  invoiceNumber: string;
  returnDate: string; // ISO string 'YYYY-MM-DD'
  quantity: number;
  remark: string;
  adjustmentId?: number; // Optional, as not all claims might have an adjustment
  adjustmentType?: string;
  adjustmentDetails?: string;
  adjustmentDate?: string; // Date of adjustment
  // NEW: Add resolutionType to CombinedClaimRecord
  resolutionType?: string;
  monthYear?: string; // e.g., "2025-07" for grouping
}

interface SummaryKpi {
  totalClaims: number;
  totalQuantityClaimed: number;
  averageQuantityPerClaim: number;
  topClaimType: string | null;
  totalAdjustments: number; // NEW KPI
}

interface GroupedClaimData {
  totalClaims: number;
  totalQuantity: number;
  claimTypes: { [key: string]: number };
  adjustmentTypes: { [key: string]: number };
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective,HeaderComponent, SidebarComponent],
  templateUrl: './claim-analysis.component.html',
  styleUrls: ['./claim-analysis.component.css']
})
export class ClaimAnalysisComponent implements OnInit {
  allClaimEntries: ClaimEntry[] = []; // Raw claim entries from backend
  allClaimAdjustments: ClaimAdjustment[] = []; // Raw claim adjustments from backend
  combinedClaimsData: CombinedClaimRecord[] = []; // Combined and processed data

  filteredClaims: CombinedClaimRecord[] = []; // Data shown in the table and used for KPIs/charts

  // Filter properties
  startDate: string = '2023-01-01'; // Default to wider range
  endDate: string = new Date().toISOString().split('T')[0]; // Default to today
  claimTypeFilter: string = '';
  // NEW: Filter for Resolution Type (optional, but good for analysis)
  resolutionTypeFilter: string = '';

  // Summary KPIs
  summary: SummaryKpi = {
    totalClaims: 0,
    totalQuantityClaimed: 0,
    averageQuantityPerClaim: 0,
    topClaimType: null,
    totalAdjustments: 0
  };

  public isBrowser: boolean;

  /* --- Chart Configurations --- */

  // 1. Claim Volume Trend (Line Chart)
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Claims Volume',
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#36A2EB',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75,192,192,1)'
      }
    ],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'Number of Claims' }, beginAtZero: true }
    }
  };
  public lineChartType: ChartType = 'line';

  // 2. Claims by Type (Bar Chart)
  public claimTypeBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Number of Claims',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'],
        borderWidth: 1
      }
    ],
    labels: []
  };
  public claimTypeBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Claim Type' } },
      y: { display: true, title: { display: true, text: 'Number of Claims' }, beginAtZero: true }
    }
  };
  public claimTypeBarChartType: ChartType = 'bar';

  // 3. Quantity Claimed by Type (Bar Chart)
  public quantityBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Quantity Claimed (Kg)',
        backgroundColor: ['#FF9900', '#9966FF', '#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384'],
        borderColor: ['#FF9900', '#9966FF', '#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384'],
        borderWidth: 1
      }
    ],
    labels: []
  };
  public quantityBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Claim Type' } },
      y: { display: true, title: { display: true, text: 'Total Quantity (Kg)' }, beginAtZero: true }
    }
  };
  public quantityBarChartType: ChartType = 'bar';

  // 4. Adjustments by Type (Doughnut Chart)
  public adjustmentDoughnutChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900']
      }
    ],
    labels: []
  };
  public adjustmentDoughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: { enabled: true }
    }
  };
  public adjustmentDoughnutChartType: ChartType = 'doughnut';


  constructor(
    private router: Router,
    private claimEntryService: ClaimEntryService,
    private claimAdjustmentService: ClaimAdjustmentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadClaimsAndAdjustmentsData();
  }

  loadClaimsAndAdjustmentsData(): void {
    forkJoin([
      this.claimEntryService.getClaimEntries(),
      this.claimAdjustmentService.getClaimAdjustments()
    ]).subscribe({
      next: ([claims, adjustments]: [ClaimEntry[], ClaimAdjustment[]]) => {
        this.allClaimEntries = claims.map(c => ({
          ...c,
          returnDate: c.returnDate ? new Date(c.returnDate).toISOString().split('T')[0] : '' // Ensure YYYY-MM-DD
        })).sort((a: ClaimEntry, b: ClaimEntry) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime());

        this.allClaimAdjustments = adjustments.map(a => ({
          ...a,
          adjustmentDate: a.adjustmentDate ? new Date(a.adjustmentDate).toISOString().split('T')[0] : '' // Ensure YYYY-MM-DD
        })).sort((a: ClaimAdjustment, b: ClaimAdjustment) => new Date(a.adjustmentDate).getTime() - new Date(b.adjustmentDate).getTime());

        console.log('All Claim Entries:', this.allClaimEntries);
        console.log('All Claim Adjustments:', this.allClaimAdjustments);

        this.combineAndProcessData(); // Combine data after both are loaded
        this.applyFilters(); // Apply filters to the combined data
      },
      error: (error) => {
        console.error('Error loading claims and adjustments data:', error);
        alert('Failed to load claims data. Please check backend connections.');
      }
    });
  }

  // NEW: Method to combine claims and adjustments for analysis
  private combineAndProcessData(): void {
    this.combinedClaimsData = this.allClaimEntries.map(claim => {
      // Find the most recent or relevant adjustment for this claim's invoice number
      // Assuming ClaimReference in adjustment matches InvoiceNumber in claim
      // Prioritize adjustment.resolutionType if available, otherwise use claim.resolutionType
      const matchingAdjustments = this.allClaimAdjustments.filter(adj => adj.claimReference === claim.invoiceNumber);
      const latestAdjustment = matchingAdjustments.sort((a, b) => new Date(b.adjustmentDate).getTime() - new Date(a.adjustmentDate).getTime())[0];

      return {
        claimId: claim.id || 0,
        claimType: claim.claimType,
        invoiceNumber: claim.invoiceNumber,
        returnDate: claim.returnDate,
        quantity: claim.quantity,
        remark: claim.remark,
        adjustmentId: latestAdjustment?.id,
        adjustmentType: latestAdjustment?.adjustmentType,
        adjustmentDetails: latestAdjustment?.adjustmentDetails,
        adjustmentDate: latestAdjustment?.adjustmentDate,
        // NEW: Map resolutionType from ClaimEntry or ClaimAdjustment
        resolutionType: claim.resolutionType || latestAdjustment?.resolutionType || '', // Use claim's resolution or latest adjustment's
        monthYear: claim.returnDate.substring(0, 7) // For monthly grouping
      };
    });
  }


  applyFilters(): void {
    let tempClaims = [...this.combinedClaimsData]; // Filter from combined data

    // Set default date range to current month if not set
    if (!this.startDate || !this.endDate) {
      const today = new Date();
      this.startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    }

    // Filter by Date Range
    if (this.startDate) {
      tempClaims = tempClaims.filter(claim => new Date(claim.returnDate) >= new Date(this.startDate));
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setDate(end.getDate() + 1);
      tempClaims = tempClaims.filter(claim => new Date(claim.returnDate) < end);
    }

    // Filter by Claim Type
    if (this.claimTypeFilter) {
      tempClaims = tempClaims.filter(claim => claim.claimType === this.claimTypeFilter);
    }
    // NEW: Filter by Resolution Type
    if (this.resolutionTypeFilter) {
      tempClaims = tempClaims.filter(claim => claim.resolutionType === this.resolutionTypeFilter);
    }

    this.filteredClaims = tempClaims;
    this.calculateSummaryKpis();
    if (isPlatformBrowser(this.platformId)) {
      this.updateChartData();
    }
  }

  clearFilters(): void {
    this.startDate = '2023-01-01'; // Re-set default period to wider range
    this.endDate = new Date().toISOString().split('T')[0];
    this.claimTypeFilter = '';
    // NEW: Clear resolutionTypeFilter
    this.resolutionTypeFilter = '';
    this.applyFilters();
  }

  calculateSummaryKpis(): void {
    this.summary.totalClaims = this.filteredClaims.length;
    this.summary.totalQuantityClaimed = this.filteredClaims.reduce((sum, claim) => sum + claim.quantity, 0);
    this.summary.averageQuantityPerClaim = this.summary.totalClaims > 0 ?
      parseFloat((this.summary.totalQuantityClaimed / this.summary.totalClaims).toFixed(2)) : 0;

    const claimTypeCounts: { [key: string]: number } = {};
    this.filteredClaims.forEach(claim => {
      claimTypeCounts[claim.claimType] = (claimTypeCounts[claim.claimType] || 0) + 1;
    });

    let topType: string | null = null;
    let maxCount = 0;
    for (const type in claimTypeCounts) {
      if (claimTypeCounts[type] > maxCount) {
        maxCount = claimTypeCounts[type];
        topType = type;
      }
    }
    this.summary.topClaimType = topType;

    this.summary.totalAdjustments = this.filteredClaims.filter(c => c.adjustmentId).length;
  }

  /* --- Data Processing for Charts --- */
  private updateChartData(): void {
    const monthlyClaimCounts: { [key: string]: number } = {};
    this.filteredClaims.forEach(claim => {
      const month = claim.monthYear || 'Unknown';
      monthlyClaimCounts[month] = (monthlyClaimCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyClaimCounts).sort();
    const claimVolumes = sortedMonths.map(month => monthlyClaimCounts[month]);

    this.lineChartData.labels = [...sortedMonths];
    this.lineChartData.datasets = [{ ...this.lineChartData.datasets[0], data: claimVolumes }];


    const claimTypeCounts: { [key: string]: number } = {};
    this.filteredClaims.forEach(claim => {
      claimTypeCounts[claim.claimType] = (claimTypeCounts[claim.claimType] || 0) + 1;
    });
    const sortedClaimTypes = Object.keys(claimTypeCounts).sort();
    const claimTypeValues = sortedClaimTypes.map(type => claimTypeCounts[type]);

    this.claimTypeBarChartData.labels = [...sortedClaimTypes];
    this.claimTypeBarChartData.datasets = [{ ...this.claimTypeBarChartData.datasets[0], data: claimTypeValues }];


    const quantityByType: { [key: string]: number } = {};
    this.filteredClaims.forEach(claim => {
      quantityByType[claim.claimType] = (quantityByType[claim.claimType] || 0) + claim.quantity;
    });
    const sortedQuantityTypes = Object.keys(quantityByType).sort();
    const quantityValues = sortedQuantityTypes.map(type => quantityByType[type]);

    this.quantityBarChartData.labels = [...sortedQuantityTypes];
    this.quantityBarChartData.datasets = [{ ...this.quantityBarChartData.datasets[0], data: quantityValues }];


    const adjustmentTypeCounts: { [key: string]: number } = {};
    // Only count adjustments that were successfully linked to a claim in combinedClaimsData
    this.filteredClaims.filter(claim => claim.adjustmentType).forEach(claim => {
      if (claim.adjustmentType) {
        adjustmentTypeCounts[claim.adjustmentType] = (adjustmentTypeCounts[claim.adjustmentType] || 0) + 1;
      }
    });
    const sortedAdjustmentTypes = Object.keys(adjustmentTypeCounts).sort();
    const adjustmentValues = sortedAdjustmentTypes.map(type => adjustmentTypeCounts[type]);

    this.adjustmentDoughnutChartData.labels = [...sortedAdjustmentTypes];
    this.adjustmentDoughnutChartData.datasets = [{ ...this.adjustmentDoughnutChartData.datasets[0], data: adjustmentValues }];
  }

  exportToCsv(): void {
    if (this.filteredClaims.length === 0) {
      alert('No data to export.');
      return;
    }

    // Define CSV headers based on your table columns
    const headers = [
      'Claim No.', 'Claim Type', 'Invoice Number', 'Return Date',
      'Quantity (Kg)', 'Remarks', 'Adjustment Type', 'Adjustment Details', 'Adjustment Date', 'Resolution Type' // NEW: Added Resolution Type
    ];

    // Map your filteredClaims data to CSV rows
    // Ensure data matches the header order and is properly formatted/escaped
    const csvRows = this.filteredClaims.map(record => {
      // Helper function to escape values for CSV
      const escapeCsv = (value: any): string => {
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        // If the value contains a comma, double quote, or newline, enclose it in double quotes
        // and escape any existing double quotes by doubling them.
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      return [
        escapeCsv(record.claimId),
        escapeCsv(record.claimType),
        escapeCsv(record.invoiceNumber),
        escapeCsv(record.returnDate ? new Date(record.returnDate).toISOString().split('T')[0] : 'N/A'), // Format date
        escapeCsv(record.quantity),
        escapeCsv(record.remark),
        escapeCsv(record.adjustmentType || 'N/A'),
        escapeCsv(record.adjustmentDetails || 'N/A'),
        escapeCsv(record.adjustmentDate ? new Date(record.adjustmentDate).toISOString().split('T')[0] : 'N/A'), // Format date
        escapeCsv(record.resolutionType || 'N/A') // NEW: Include Resolution Type
      ].join(','); // Join values with a comma
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','), // First row is headers
      ...csvRows          // Subsequent rows are data
    ].join('\n');         // Join all rows with a newline

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the Blob and trigger download
    if (this.isBrowser) { // Ensure this runs only in the browser environment
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `claims_report_${new Date().toISOString().split('T')[0]}.csv`); // Dynamic filename
      link.style.visibility = 'hidden'; // Hide the link
      document.body.appendChild(link); // Append to body to make it clickable
      link.click(); // Programmatically click the link to trigger download
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url); // Release the object URL
    } else {
      console.warn('CSV export is not supported in server-side rendering.');
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

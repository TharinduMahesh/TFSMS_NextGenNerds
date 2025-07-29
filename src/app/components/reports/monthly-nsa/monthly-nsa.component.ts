import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HeaderComponent } from "../../header/header.component";
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';

import { NsaService } from '../../../Services/nsa.service'; 
import { NsaEntry } from '../../../models/nsa-entry.interface'; 
import { MonthlyNsaService } from '../../../Services/monthly-nsa.service'; 
import { MonthlyNsaSummary } from '../../../models/monthly-nsa-summary.interface'; 


interface NsaSummaryKpi {
  overallNsa: number;
  totalAdjustedKilos: number;
  totalAdjustedProceeds: number;
  numberOfEntries: number;
  nsaVariance: number; // Percentage variance from previous period
}

interface PeriodSummary {
  period: string;
  adjustedKilos: number;
  adjustedProceeds: number;
  nsaValue: number;
  variance: number; // Percentage variance from previous period's NSA
}

interface GroupedNsaData {
  totalProceeds: number;
  totalKilos: number;
  count: number;
  nsa: number;
}


@Component({
  selector: 'app-monthly-nsa',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, HeaderComponent, SidebarComponent],
  templateUrl: './monthly-nsa.component.html',
  styleUrls: ['./monthly-nsa.component.css']
})
export class MonthlyNsaComponent implements OnInit {
  // Data for the report
  public isBrowser: boolean;
  allNsaRecords: NsaEntry[] = []; // Raw data from NSA Entry (now from backend)
  monthlySummaries: MonthlyNsaSummary[] = []; // Aggregated data from backend
  filteredNsaRecords: NsaEntry[] = []; // Filtered raw data for the table
   periodSummaries: PeriodSummary[] = [];

  // Filter properties
  selectedPeriod: string = 'last6Months'; // Default filter for this report
  startDate: string = '';
  endDate: string = '';
  displayPeriod: string = '';
  reportGeneratedDate: Date = new Date();

  // Summary KPIs
  summary: NsaSummaryKpi = {
    overallNsa: 0,
    totalAdjustedKilos: 0,
    totalAdjustedProceeds: 0,
    numberOfEntries: 0,
    nsaVariance: 0
  };

  chartPeriodUnit: string = 'Monthly';


  /* --- Chart Configurations --- */

  // 1. NSA Trend Over Time (Line Chart)
  public monthlyNsaChartData: ChartConfiguration['data'] = { // Renamed from nsaTrendLineChartData for clarity in this component
    datasets: [
      {
        data: [],
        label: 'Monthly NSA',
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
  public monthlyNsaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'Monthly NSA Value' }, beginAtZero: true }
    }
  };
  public monthlyNsaChartType: ChartType = 'line';

  // 2. Adjusted Proceeds Trend (Bar Chart)
  public adjustedProceedsBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Adjusted Proceeds',
        backgroundColor: 'rgba(255,159,64,0.6)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1
      }
    ],
    labels: []
  };
  public adjustedProceedsBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Period' } },
      y: { display: true, title: { display: true, text: 'Total Adjusted Proceeds' }, beginAtZero: true }
    }
  };
  public adjustedProceedsBarChartType: ChartType = 'bar';

  // 3. Adjusted Kilos Trend (Bar Chart)
  public adjustedKilosBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Adjusted Kilos',
        backgroundColor: 'rgba(153,102,255,0.6)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1
      }
    ],
    labels: []
  };
  public adjustedKilosBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Period' } },
      y: { display: true, title: { display: true, text: 'Total Adjusted Kilos' }, beginAtZero: true }
    }
  };
  public adjustedKilosBarChartType: ChartType = 'bar';

  // 4. NSA Comparison (Bar Chart) - Simple comparison
  public nsaComparisonBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'NSA Value',
        backgroundColor: ['#36A2EB', '#FFCE56'],
        borderColor: ['#36A2EB', '#FFCE56'],
        borderWidth: 1
      }
    ],
    labels: ['Filtered Period NSA', 'Target NSA'] // Labels will be static for this comparison
  };
  public nsaComparisonBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Metric' } },
      y: { display: true, title: { display: true, text: 'NSA Value' }, beginAtZero: true }
    }
  };
  public nsaComparisonBarChartType: ChartType = 'bar';

  // Deductions Breakdown (Doughnut Chart) - Remains dummy for now, as it needs more data sources
  public deductionsDoughnutChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [100, 50, 20, 10], // Dummy data for now
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ],
    labels: ['Returns', 'Discounts', 'Sales Charges', 'Gratis Issues'] // Dummy labels
  };
  public deductionsDoughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: { enabled: true }
    }
  };
  public deductionsDoughnutChartType: ChartType = 'doughnut';


  constructor(
    private router: Router,
    private nsaService: NsaService, // Inject NSA Entry service for raw data
    private monthlyNsaService: MonthlyNsaService, // Inject Monthly NSA Summary service for aggregated data
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Initialize it in constructor
  }

  ngOnInit(): void {
    this.reportGeneratedDate = new Date();
    this.setInitialPeriod();
    this.loadAllNsaData(); // Load raw NSA entries
    this.loadMonthlyNsaSummaries(); // Load aggregated monthly summaries
  }

  private setInitialPeriod(): void {
    const today = new Date();
    let calculatedStartDate: Date;
    let calculatedEndDate: Date;

    this.selectedPeriod = 'last6Months';

    switch (this.selectedPeriod) {
      case 'currentMonth':
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long' })} ${calculatedStartDate.getFullYear()}`;
        break;
      case 'last3Months':
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long', year: 'numeric' })} - ${calculatedEndDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
        break;
      case 'last6Months':
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long', year: 'numeric' })} - ${calculatedEndDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
        break;
      case 'currentQuarter':
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        calculatedStartDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
        calculatedEndDate = new Date(today.getFullYear(), currentQuarter * 3 + 3, 0);
        this.displayPeriod = `Q${currentQuarter + 1} ${today.getFullYear()}`;
        break;
      case 'currentYear':
        calculatedStartDate = new Date(today.getFullYear(), 0, 1);
        calculatedEndDate = new Date(today.getFullYear(), 11, 31);
        this.displayPeriod = `${today.getFullYear()}`;
        break;
      case 'custom':
        calculatedStartDate = this.startDate ? new Date(this.startDate) : new Date(0);
        calculatedEndDate = this.endDate ? new Date(this.endDate) : new Date();
        this.displayPeriod = `${calculatedStartDate.toISOString().split('T')[0]} to ${calculatedEndDate.toISOString().split('T')[0]}`;
        break;
      default:
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long' })} ${calculatedStartDate.getFullYear()}`;
        break;
    }

    this.startDate = calculatedStartDate.toISOString().split('T')[0];
    this.endDate = calculatedEndDate.toISOString().split('T')[0];
  }

  // Load raw NSA entries for the detailed table
  loadAllNsaData(): void {
    this.nsaService.getNsaEntries().subscribe({
      next: (data: NsaEntry[]) => {
        this.allNsaRecords = data.map(entry => ({
          ...entry,
          monthYear: entry.entryDate.substring(0, 7)
        })).sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
        console.log('Raw NSA records loaded from backend:', this.allNsaRecords);
        // Apply filters to raw data for the table
        this.filterRawDataForTable();
      },
      error: (error) => {
        console.error('Error loading raw NSA records from backend:', error);
        alert('Failed to load raw NSA data. Please check the backend connection.');
      }
    });
  }

  // Load aggregated monthly NSA summaries for charts and period summary table
  loadMonthlyNsaSummaries(): void {
    this.monthlyNsaService.getMonthlyNsaSummaries(this.startDate, this.endDate).subscribe({
      next: (data: MonthlyNsaSummary[]) => {
        this.monthlySummaries = data;
        console.log('Monthly NSA summaries loaded:', this.monthlySummaries);
        this.calculateSummaryKpis(); // Calculate KPIs based on aggregated data
        if (isPlatformBrowser(this.platformId)) {
          this.updateChartData(); // Update charts
        }
        this.generatePeriodSummariesTable(); // Generate data for period summary table
      },
      error: (error) => {
        console.error('Error loading monthly NSA summaries from backend:', error);
        alert('Failed to load monthly NSA summary data. Please check the backend connection.');
      }
    });
  }

  applyFilters(): void {
    this.reportGeneratedDate = new Date();

    // Recalculate start/end dates based on selectedPeriod for backend calls
    this.setInitialPeriod(); // This updates this.startDate and this.endDate

    // Trigger data re-fetch for both raw and aggregated data
    this.loadAllNsaData(); // Re-fetches raw data for the table
    this.loadMonthlyNsaSummaries(); // Re-fetches aggregated data for charts/KPIs
  }

  clearFilters(): void {
    this.selectedPeriod = 'last6Months';
    this.setInitialPeriod();
    this.loadAllNsaData(); // Reload raw data for default period
    this.loadMonthlyNsaSummaries(); // Reload aggregated data for default period
  }

  // Filter raw data for the table based on the current period
  private filterRawDataForTable(): void {
    const calculatedStartDate = new Date(this.startDate);
    const calculatedEndDate = new Date(this.endDate);
    calculatedEndDate.setDate(calculatedEndDate.getDate() + 1); // Include end date

    this.filteredNsaRecords = this.allNsaRecords.filter(record => {
      const recordDate = new Date(record.entryDate);
      return recordDate >= calculatedStartDate && recordDate < calculatedEndDate;
    });
  }

  calculateSummaryKpis(): void {
    // KPIs are now calculated from 'monthlySummaries' (aggregated data)
    this.summary.numberOfEntries = this.monthlySummaries.reduce((sum, s) => sum + s.totalAdjustedKilos, 0); // Approx count based on kilos
    this.summary.totalAdjustedKilos = this.monthlySummaries.reduce((sum, s) => sum + s.totalAdjustedKilos, 0);
    this.summary.totalAdjustedProceeds = this.monthlySummaries.reduce((sum, s) => sum + s.totalAdjustedProceeds, 0);

    // Calculate Overall NSA for the *entire filtered period* based on aggregated totals
    this.summary.overallNsa = this.summary.totalAdjustedKilos > 0 ?
      parseFloat((this.summary.totalAdjustedProceeds / this.summary.totalAdjustedKilos).toFixed(2)) : 0;

    // Calculate NSA Variance to Previous Period based on monthlySummaries
    let previousPeriodNsa = 0;
    if (this.monthlySummaries.length > 1) {
      previousPeriodNsa = this.monthlySummaries[this.monthlySummaries.length - 2].monthlyNsaValue;
    } else {
      // Fallback if less than 2 months of data, or use a fixed target
      previousPeriodNsa = 3.50; // Example fixed previous period NSA
    }

    this.summary.nsaVariance = previousPeriodNsa > 0 ?
      parseFloat((((this.summary.overallNsa - previousPeriodNsa) / previousPeriodNsa) * 100).toFixed(2)) : 0;

    // Update NSA Comparison Chart data
    const targetNsa = 3.55;
    if (this.nsaComparisonBarChartData.datasets && this.nsaComparisonBarChartData.datasets.length > 0) {
      this.nsaComparisonBarChartData.datasets = [
        {
          ...this.nsaComparisonBarChartData.datasets[0],
          data: [
            parseFloat(this.summary.overallNsa.toFixed(2)),
            targetNsa
          ]
        }
      ];
    }
  }

  private updateChartData(): void {
    const labels = this.monthlySummaries.map(s => s.monthYear);
    const nsaValues = this.monthlySummaries.map(s => s.monthlyNsaValue);
    const kilosValues = this.monthlySummaries.map(s => s.totalAdjustedKilos);
    const proceedsValues = this.monthlySummaries.map(s => s.totalAdjustedProceeds);

    // 1. NSA Trend Over Time (Line Chart)
    this.monthlyNsaChartData.labels = [...labels];
    this.monthlyNsaChartData.datasets = [{ ...this.monthlyNsaChartData.datasets[0], data: nsaValues }];

    // 2. Adjusted Proceeds Trend (Bar Chart)
    this.adjustedProceedsBarChartData.labels = [...labels];
    this.adjustedProceedsBarChartData.datasets = [{ ...this.adjustedProceedsBarChartData.datasets[0], data: proceedsValues }];

    // 3. Adjusted Kilos Trend (Bar Chart)
    this.adjustedKilosBarChartData.labels = [...labels];
    this.adjustedKilosBarChartData.datasets = [{ ...this.adjustedKilosBarChartData.datasets[0], data: kilosValues }];

    // Deductions Breakdown (Doughnut Chart) - Still dummy data for now
    // This chart would require fetching data about returns, discounts, etc.
    // from other backend sources (e.g., Claims, Returns, Sales Charges tables).
  }

  private generatePeriodSummariesTable(): void {
    const tempPeriodSummaries: PeriodSummary[] = [];
    let previousNsa = 0;

    this.monthlySummaries.forEach((summary, index) => {
      let variance = 0;
      if (index > 0) { // Only calculate variance if there's a previous period
        previousNsa = this.monthlySummaries[index - 1].monthlyNsaValue;
        if (previousNsa > 0) {
          variance = parseFloat((((summary.monthlyNsaValue - previousNsa) / previousNsa) * 100).toFixed(2));
        }
      }

      tempPeriodSummaries.push({
        period: summary.monthYear,
        adjustedKilos: summary.totalAdjustedKilos,
        adjustedProceeds: summary.totalAdjustedProceeds,
        nsaValue: summary.monthlyNsaValue,
        variance: variance
      });
    });

    this.periodSummaries = tempPeriodSummaries;
  }

  exportReport(): void {
    alert('Export Report (CSV) functionality will be implemented here.');
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

import { NsaReportService } from '../../../Services/nsa-report.service';
// FIX: Corrected import path for nsa-report.interface
import { NsaEntry } from '../../../models/nsa-entry.interface'; // Ensure this path is correct: '../../../models/nsa-report.interface'

// FIX: Corrected SummaryKpi interface properties to match HTML/logic
interface SummaryKpi {
  totalNsaEntries: number; // Matches HTML 'numberOfEntries' (used in template as totalNsaEntries)
  overallNsaValue: number; // Matches HTML 'overallNsa' (used in template as overallNsaValue)
  totalAdjustedKilos: number;
  totalProceedsImpact: number; // Matches HTML 'totalAdjustedProceeds' (used in template as totalProceedsImpact)
}

@Component({
  selector: 'app-nsa-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, HeaderComponent],
  templateUrl: './nsa-analysis.component.html',
  styleUrls: ['./nsa-analysis.component.css']
})
export class NsaAnalysisComponent implements OnInit {
  allNsaRecords: NsaEntry[] = [];
  filteredNsaRecords: NsaEntry[] = [];

  startDate: string = '2023-01-01';
  endDate: string = new Date().toISOString().split('T')[0];

  summary: SummaryKpi = {
    totalNsaEntries: 0,
    overallNsaValue: 0,
    totalAdjustedKilos: 0,
    totalProceedsImpact: 0,
  };

  public isBrowser: boolean;

  /* --- Chart Configurations --- */
  public nsaTrendChartData: ChartConfiguration['data'] = { // Corrected name
    datasets: [
      {
        data: [],
        label: 'NSA Value',
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
  public nsaTrendChartOptions: ChartConfiguration['options'] = { // Corrected name
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'NSA Value' }, beginAtZero: true }
    }
  };
  public nsaTrendChartType: ChartType = 'line'; // Corrected name

  // NEW: Adjusted Kilos Bar Chart
  public adjustedKilosBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Adjusted Kilos',
        backgroundColor: ['#FF9900', '#9966FF', '#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384'],
        borderColor: ['#FF9900', '#9966FF', '#4BC0C0', '#FFCE56', '#36A2EB', '#FF6384'],
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
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'Total Adjusted Kilos' }, beginAtZero: true }
    }
  };
  public adjustedKilosBarChartType: ChartType = 'bar';

  // NEW: Adjusted Proceeds Bar Chart
  public adjustedProceedsBarChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Adjusted Proceeds',
        backgroundColor: ['#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#4BC0C0', '#9966FF', '#FF9900', '#FF6384', '#36A2EB', '#FFCE56'],
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
      x: { display: true, title: { display: true, text: 'Month' } },
      y: { display: true, title: { display: true, text: 'Total Adjusted Proceeds' }, beginAtZero: true }
    }
  };
  public adjustedProceedsBarChartType: ChartType = 'bar';

  // NEW: NSA Comparison Bar Chart (e.g., current month vs previous) - placeholder
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
    labels: []
  };
  public nsaComparisonBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Period' } },
      y: { display: true, title: { display: true, text: 'NSA Value' }, beginAtZero: true }
    }
  };
  public nsaComparisonBarChartType: ChartType = 'bar';


  constructor(
    private router: Router,
    private nsaReportService: NsaReportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadNsaRecords();
  }

  loadNsaRecords(): void {
    this.nsaReportService.getNsaReports(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.allNsaRecords = data.map(entry => ({
          ...entry,
          monthYear: new Date(entry.entryDate).toISOString().substring(0, 7)
        })).sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

        console.log('NSA Analysis records loaded:', this.allNsaRecords);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading NSA analysis report:', error);
        if (this.isBrowser) {
          alert('Failed to load NSA analysis report. Please check backend connections.');
        }
      }
    });
  }

  applyFilters(): void {
    let tempRecords = [...this.allNsaRecords];

    if (this.startDate) {
      tempRecords = tempRecords.filter(record => new Date(record.entryDate) >= new Date(this.startDate));
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setDate(end.getDate() + 1);
      tempRecords = tempRecords.filter(record => new Date(record.entryDate) < end);
    }

    this.filteredNsaRecords = tempRecords;
    this.calculateSummaryKpis();
    if (this.isBrowser) {
      this.updateChartData();
    }
  }

  clearFilters(): void {
    this.startDate = '2023-01-01';
    this.endDate = new Date().toISOString().split('T')[0];
    this.loadNsaRecords();
  }

  calculateSummaryKpis(): void {
    this.summary.totalNsaEntries = this.filteredNsaRecords.length;
    this.summary.totalAdjustedKilos = this.filteredNsaRecords.reduce((sum, entry) => sum + entry.adjustedKilos, 0);
    this.summary.totalProceedsImpact = this.filteredNsaRecords.reduce((sum, entry) => sum + entry.adjustedProceeds, 0 as number); // FIX: Use '0 as number'

    const totalNetKilos = this.filteredNsaRecords.reduce((sum, entry) => sum + (entry.monthlyKilosSold - entry.adjustedKilos), 0);
    const totalNetProceeds = this.filteredNsaRecords.reduce((sum, entry) => sum + (entry.proceeds - entry.adjustedProceeds), 0 as number); // FIX: Use '0 as number'
    this.summary.overallNsaValue = totalNetKilos > 0 ? parseFloat((totalNetProceeds / totalNetKilos).toFixed(2)) : 0;
  }

  private updateChartData(): void {
    const monthlyNsaAggregated: { [key: string]: { sum: number, count: number } } = {};
    this.filteredNsaRecords.forEach(entry => {
      const month = entry.monthYear || 'Unknown';
      if (!monthlyNsaAggregated[month]) {
        monthlyNsaAggregated[month] = { sum: 0, count: 0 };
      }
      monthlyNsaAggregated[month].sum += entry.nsaValue;
      monthlyNsaAggregated[month].count += 1;
    });

    const sortedMonths = Object.keys(monthlyNsaAggregated).sort();
    const nsaValues = sortedMonths.map(month => {
      const agg = monthlyNsaAggregated[month];
      return agg.count > 0 ? parseFloat((agg.sum / agg.count).toFixed(2)) : 0;
    });

    this.nsaTrendChartData.labels = [...sortedMonths];
    this.nsaTrendChartData.datasets = [{ ...this.nsaTrendChartData.datasets[0], data: nsaValues }];

    // Adjusted Kilos Bar Chart
    const monthlyAdjustedKilos: { [key: string]: number } = {};
    this.filteredNsaRecords.forEach(entry => {
        const month = entry.monthYear || 'Unknown';
        monthlyAdjustedKilos[month] = (monthlyAdjustedKilos[month] || 0) + entry.adjustedKilos;
    });
    const sortedAdjustedKilosMonths = Object.keys(monthlyAdjustedKilos).sort();
    const adjustedKilosValues = sortedAdjustedKilosMonths.map(month => monthlyAdjustedKilos[month]);

    this.adjustedKilosBarChartData.labels = [...sortedAdjustedKilosMonths];
    this.adjustedKilosBarChartData.datasets = [{ ...this.adjustedKilosBarChartData.datasets[0], data: adjustedKilosValues }];

    // Adjusted Proceeds Bar Chart
    const monthlyAdjustedProceeds: { [key: string]: number } = {};
    this.filteredNsaRecords.forEach(entry => {
        const month = entry.monthYear || 'Unknown';
        monthlyAdjustedProceeds[month] = (monthlyAdjustedProceeds[month] || 0) + parseFloat(entry.adjustedProceeds.toFixed(2));
    });
    const sortedAdjustedProceedsMonths = Object.keys(monthlyAdjustedProceeds).sort();
    const adjustedProceedsValues = sortedAdjustedProceedsMonths.map(month => monthlyAdjustedProceeds[month]);

    this.adjustedProceedsBarChartData.labels = [...sortedAdjustedProceedsMonths];
    this.adjustedProceedsBarChartData.datasets = [{ ...this.adjustedProceedsBarChartData.datasets[0], data: adjustedProceedsValues }];

    // NSA Comparison Bar Chart (Placeholder for now)
    if (this.filteredNsaRecords.length >= 2) {
        const latestMonth = sortedMonths[sortedMonths.length - 1];
        const secondLatestMonth = sortedMonths[sortedMonths.length - 2];

        const latestNsa = monthlyNsaAggregated[latestMonth] ? parseFloat((monthlyNsaAggregated[latestMonth].sum / monthlyNsaAggregated[latestMonth].count).toFixed(2)) : 0;
        const secondLatestNsa = monthlyNsaAggregated[secondLatestMonth] ? parseFloat((monthlyNsaAggregated[secondLatestMonth].sum / monthlyNsaAggregated[secondLatestMonth].count).toFixed(2)) : 0;

        this.nsaComparisonBarChartData.labels = [secondLatestMonth, latestMonth];
        this.nsaComparisonBarChartData.datasets = [{ ...this.nsaComparisonBarChartData.datasets[0], data: [secondLatestNsa, latestNsa] }];
    } else {
        this.nsaComparisonBarChartData.labels = [];
        this.nsaComparisonBarChartData.datasets = [{ ...this.nsaComparisonBarChartData.datasets[0], data: [] }];
    }
  }

  formatDate(dateString: string | undefined): string {
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

  exportToCsv(): void {
    if (this.filteredNsaRecords.length === 0) {
      if (this.isBrowser) {
        alert('No data to export.');
      }
      return;
    }

    const headers = [
      'Entry No.', 'Entry Date', 'Monthly Kilos Sold', 'Proceeds',
      'Adjusted Kilos', 'Adjusted Proceeds', 'NSA Value'
    ];

    const csvRows = this.filteredNsaRecords.map(record => {
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
        escapeCsv(this.formatDate(record.entryDate)),
        escapeCsv(record.monthlyKilosSold),
        escapeCsv(record.proceeds),
        escapeCsv(record.adjustedKilos),
        escapeCsv(record.adjustedProceeds),
        escapeCsv(record.nsaValue)
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
      link.setAttribute('download', `nsa_analysis_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.warn('CSV export is not supported in server-side rendering.');
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

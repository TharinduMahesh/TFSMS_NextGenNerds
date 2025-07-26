import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { PNavbarComponent } from "../../../components/pnav bar/pnav.component";

// Models and Services
import { CollectorCostReport } from '../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../Services/LogisticAndTransport/TransportReport.service';

@Component({
  selector: 'app-cost-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxChartsModule, PNavbarComponent, DecimalPipe, CurrencyPipe],
  templateUrl: './cost-analysis.component.html',
  styleUrls: ['./cost-analysis.component.scss']
})
export class CostAnalysisComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);

  reportForm: FormGroup;
  
  // State for the raw report data
  reportData = signal<CollectorCostReport[]>([]);
  
  // Signals for the UI
  isLoading = signal(true);
  error = signal<string | null>(null);
  chartData = signal<{ name: string, value: number }[]>([]);
  
  // Signals for KPI cards
  totalCost = signal<number>(0);
  totalTrips = signal<number>(0);
  averageCostPerTrip = signal<number>(0);
  
  // Signals for insights panel
  highestCostCollector = signal<CollectorCostReport | null>(null);
  lowestCostCollector = signal<CollectorCostReport | null>(null);

  // ngx-charts options
  chartColorScheme: Color = {
    name: 'costPalette',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3498db', '#1abc9c', '#9b59b6', '#e74c3c', '#f1c40f'],
  };
  xAxisLabel = "Collector";
  yAxisLabel = "Total Cost (LKR)";

  constructor() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    this.reportForm = this.fb.group({
      startDate: [this.formatDate(oneMonthAgo), Validators.required],
      endDate: [this.formatDate(today), Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateReport();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  generateReport(): void {
    if (this.reportForm.invalid) return;
    
    this.isLoading.set(true);
    this.error.set(null);
    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getCostByCollector(startDate, endDate).subscribe({
      next: (data) => {
        const sortedData = data.sort((a, b) => b.totalCost - a.totalCost);
        this.reportData.set(sortedData);
        this.calculateSummaries(sortedData);
        this.prepareChartData(sortedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
  
  private calculateSummaries(data: CollectorCostReport[]): void {
    if (data.length === 0) {
        this.totalCost.set(0);
        this.totalTrips.set(0);
        this.averageCostPerTrip.set(0);
        this.highestCostCollector.set(null);
        this.lowestCostCollector.set(null);
        return;
    }
    const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
    const totalTrips = data.reduce((sum, item) => sum + item.totalTrips, 0);
    
    this.totalCost.set(totalCost);
    this.totalTrips.set(totalTrips);
    this.averageCostPerTrip.set(totalTrips > 0 ? totalCost / totalTrips : 0);
    
    this.highestCostCollector.set(data[0]); // Data is pre-sorted
    this.lowestCostCollector.set(data[data.length - 1]);
  }
  
  private prepareChartData(data: CollectorCostReport[]): void {
    this.chartData.set(
      data.slice(0, 20).map(item => ({ // Chart only the top 10
        name: item.collectorName,
        value: item.totalCost
      }))
    );
  }
}
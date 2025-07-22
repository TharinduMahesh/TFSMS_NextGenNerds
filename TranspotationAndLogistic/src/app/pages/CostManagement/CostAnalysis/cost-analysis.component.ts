import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

// Models and Services
import { CollectorCostReport } from '../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../services/LogisticAndTransport/TransportReport.service';
import { PNavbarComponent } from "../../../components/pnav bar/pnav.component ";

@Component({
  selector: 'app-cost-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxChartsModule, CurrencyPipe, DecimalPipe, PNavbarComponent],
  templateUrl: './cost-analysis.component.html',
  styleUrls: ['./cost-analysis.component.scss']
})
export class CostAnalysisComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);

  reportForm: FormGroup;
  
  reportData = signal<CollectorCostReport[]>([]);
  chartData = signal<{ name: string, value: number }[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // --- NEW: Signals for Summary Cards ---
  totalCost = signal<number>(0);
  totalTrips = signal<number>(0);
  averageCostPerTrip = signal<number>(0);

  // --- NEW: Signals for Insights ---
  highestCostCollector = signal<CollectorCostReport | null>(null);
  lowestCostCollector = signal<CollectorCostReport | null>(null);

  // ngx-charts options
  view: [number, number] = [0, 400]; // Let the container decide width
  showXAxis = true;
  showYAxis = true;
  gradient = true; // Use a gradient for better visuals
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Collector';
  showYAxisLabel = true;
  yAxisLabel = 'Total Cost (LKR)';
  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#20c997'],
  };

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
    this.reportData.set([]); // Clear previous results

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getCostByCollector(startDate, endDate).subscribe({
      next: (data) => {
        // Sort data from highest cost to lowest for better readability
        const sortedData = data.sort((a, b) => b.totalCost - a.totalCost);
        this.reportData.set(sortedData);

        // Transform data for the chart
        this.chartData.set(sortedData.map(item => ({
          name: item.collectorName,
          value: Math.round(item.totalCost)
        })));
        
        // --- NEW: Calculate summary metrics ---
        this.calculateSummaries(sortedData);
        
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  private calculateSummaries(data: CollectorCostReport[]): void {
    if (!data || data.length === 0) {
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
    
    // The data is already sorted, so the first is highest and last is lowest
    this.highestCostCollector.set(data[0]);
    this.lowestCostCollector.set(data[data.length - 1]);
  }
}
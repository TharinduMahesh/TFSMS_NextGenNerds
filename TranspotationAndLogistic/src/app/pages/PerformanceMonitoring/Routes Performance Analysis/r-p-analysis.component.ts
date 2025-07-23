import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

// Import all necessary components, models, and services
import { PNavbarComponent } from "../../../components/pnav bar/pnav.component";
import { RoutePerformanceReport } from '../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../services/LogisticAndTransport/TransportReport.service';

@Component({
  selector: 'app-route-performance-analysis',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxChartsModule,
    DecimalPipe,
    CurrencyPipe,
    PNavbarComponent
  ],
  templateUrl: './r-p-analysis.component.html',
  styleUrls: ['./r-p-analysis.component.scss']
})
export class RoutePerformanceAnalysisComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);

  reportForm: FormGroup;
  
  reportData = signal<RoutePerformanceReport[]>([]);
  chartData = signal<{ name: string; value: number }[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Signals for summary KPI cards
  bestOnTimeRoute = signal<RoutePerformanceReport | null>(null);
  leastEfficientRoute = signal<RoutePerformanceReport | null>(null);
  averageTripDuration = signal<number>(0);

  // --- ngx-charts options ---
  chartView: [number, number] = [800, 400];
  chartColorScheme: Color = {
    name: 'routeCost',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3498db', '#95a5a6', '#e74c3c', '#2ecc71', '#f1c40f'],
  };
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Route Name';                   // Correct for Vertical Chart
  yAxisLabel = 'Cost per Kilometer (LKR)';   // Correct for Vertical Chart

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
    if (this.reportForm.invalid) {
      alert('Please select both a start and end date.');
      return;
    }
    
    this.isLoading.set(true);
    this.error.set(null);
    this.reportData.set([]); // Clear previous results

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getPerformanceByRoute(startDate, endDate).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.prepareChartData(data);
        this.calculateSummaries(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate the report.');
        this.isLoading.set(false);
      }
    });
  }

  private prepareChartData(data: RoutePerformanceReport[]): void {
    const chartResult = data
      .sort((a, b) => b.costPerKm - a.costPerKm) // Sort to show most expensive first
      .map(item => ({
        name: item.routeName,
        value: item.costPerKm
      }));
    this.chartData.set(chartResult);
  }

  private calculateSummaries(data: RoutePerformanceReport[]): void {
    if (data.length === 0) {
      this.bestOnTimeRoute.set(null);
      this.leastEfficientRoute.set(null);
      this.averageTripDuration.set(0);
      return;
    }
    
    const sortedByOnTime = [...data].sort((a, b) => b.onTimeDeparturePercentage - a.onTimeDeparturePercentage);
    this.bestOnTimeRoute.set(sortedByOnTime[0]);
    
    const sortedByEfficiency = [...data].sort((a, b) => b.costPerKm - a.costPerKm);
    this.leastEfficientRoute.set(sortedByEfficiency[0]);
    
    const totalDuration = data.reduce((sum, item) => sum + (item.averageTripDurationHours * item.totalTrips), 0);
    const totalTrips = data.reduce((sum, item) => sum + item.totalTrips, 0);
    this.averageTripDuration.set(totalTrips > 0 ? totalDuration / totalTrips : 0);
  }
}
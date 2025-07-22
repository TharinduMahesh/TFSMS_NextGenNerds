import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts'; // Import for charts
import { forkJoin } from 'rxjs';

// Import all necessary models and the service
import {
  CollectorCostReport,
  CollectorPerformanceReport,
  RoutePerformanceReport
} from '../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../services/LogisticAndTransport/TransportReport.service';
import { PNavbarComponent } from '../../components/pnav/pnav.component'

@Component({
  selector: 'app-performance-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, DecimalPipe, CurrencyPipe, PNavbarComponent],
  templateUrl: './pdashboard.component.html',
  styleUrls: ['./pdashboard.component.scss']
})
export class PerformanceDashboardComponent implements OnInit {
  private reportService = inject(TransportReportService);
  private router = inject(Router);

  // --- State Signals ---
  isLoading = signal(true);
  error = signal<string | null>(null);

  // --- Data Signals for KPI Cards ---
  totalCost = signal<number>(0);
  averageOnTime = signal<number>(0);
  totalTrips = signal<number>(0);
  mostEfficientRoute = signal<RoutePerformanceReport | null>(null);
  
  // --- Data Signal for the Chart ---
  chartData = signal<{ name: string; series: { name: string; value: number }[] }[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1); // Default to last 30 days

    const startDateStr = this.formatDate(startDate);
    const endDateStr = this.formatDate(endDate);

    forkJoin({
      costs: this.reportService.getCostByCollector(startDateStr, endDateStr),
      performance: this.reportService.getPerformanceByCollector(startDateStr, endDateStr),
      routePerformance: this.reportService.getPerformanceByRoute(startDateStr, endDateStr)
    }).subscribe({
      next: ({ costs, performance, routePerformance }) => {
        this.calculateSummaries(costs, performance, routePerformance);
        this.prepareChartData(costs, performance);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dashboard data.');
        this.isLoading.set(false);
      }
    });
  }
  
  private calculateSummaries(
    costs: CollectorCostReport[],
    performance: CollectorPerformanceReport[],
    routePerformance: RoutePerformanceReport[]
  ): void {
    // Total Cost
    this.totalCost.set(costs.reduce((sum, item) => sum + item.totalCost, 0));
    
    // Total Trips
    this.totalTrips.set(performance.reduce((sum, item) => sum + item.totalTripsCompleted, 0));
    
    // Average On-Time Percentage
    if (this.totalTrips() > 0) {
      const totalOnTime = performance.reduce((sum, item) => sum + item.onTimeTrips, 0);
      this.averageOnTime.set((totalOnTime / this.totalTrips()) * 100);
    }
    
    // Most Efficient Route (lowest cost per km)
    if (routePerformance.length > 0) {
      const sortedByEfficiency = [...routePerformance].sort((a, b) => a.costPerKm - b.costPerKm);
      this.mostEfficientRoute.set(sortedByEfficiency[0]);
    }
  }

  private prepareChartData(
    costs: CollectorCostReport[],
    performance: CollectorPerformanceReport[]
  ): void {
      const performanceMap = new Map(performance.map(p => [p.collectorId, p.onTimePercentage]));
      const chartResult = costs.map(costItem => ({
        name: costItem.collectorName,
        series: [
          { name: 'Total Cost (LKR)', value: costItem.totalCost },
          { name: 'On-Time %', value: performanceMap.get(costItem.collectorId) || 0 }
        ]
      }));
      this.chartData.set(chartResult);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Navigation helper
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }

  // Chart options
  chartView: [number, number] = [0, 400];
  chartColorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
  };
}
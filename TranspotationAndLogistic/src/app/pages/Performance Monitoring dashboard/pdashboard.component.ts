import { Component, OnInit, inject } from '@angular/core';
import { signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';

// Models and Services
import { CollectorCostReport, CollectorPerformanceReport, RoutePerformanceReport } from '../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../services/LogisticAndTransport/TransportReport.service';
import { PNavbarComponent } from "../../components/pnav bar/pnav.component";

@Component({
  selector: 'app-performance-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, DecimalPipe, CurrencyPipe, PNavbarComponent],
  templateUrl: './pdashboard.component.html',
  styleUrls: ['./pdashboard.component.scss']
})
export class PerformanceDashboardComponent implements OnInit {
  // --- Injections ---
  private reportService = inject(TransportReportService);
  private router = inject(Router);

  // --- State Signals ---
  isLoading = signal(true);
  error = signal<string | null>(null);

  // --- KPI Card Signals ---
  summaryStats = signal({
    totalCost: 0,
    overallOnTime: 0,
    totalTrips: 0,
    mostEfficientRoute: 'N/A'
  });

  // --- Chart and Table Data Signals ---
  chartData = signal<{ name: string; value: number }[]>([]);
  topCostlyCollectors = signal<CollectorCostReport[]>([]);
  leastEfficientRoutes = signal<RoutePerformanceReport[]>([]);
  
  // --- ngx-charts Configuration ---
  chartColorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'],
  };
  yAxisTicks: number[] = [0, 500, 1000, 1500, 2000]; // Example ticks

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // Default to the last 30 days
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch all three reports in parallel for maximum speed
    forkJoin({
      costs: this.reportService.getCostByCollector(startDateStr, endDateStr),
      performance: this.reportService.getPerformanceByCollector(startDateStr, endDateStr),
      routePerformance: this.reportService.getPerformanceByRoute(startDateStr, endDateStr)
    }).subscribe({
      next: ({ costs, performance, routePerformance }) => {
        this.calculateSummaries(costs, performance, routePerformance);
        this.prepareVisuals(costs, routePerformance);
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
    const totalCost = costs.reduce((sum, item) => sum + item.totalCost, 0);
    const totalTrips = performance.reduce((sum, item) => sum + item.totalTripsCompleted, 0);
    const totalWeightedOnTime = performance.reduce((sum, p) => sum + (p.onTimePercentage * p.totalTripsCompleted), 0);
    const overallOnTime = totalTrips > 0 ? totalWeightedOnTime / totalTrips : 0;
    
    const sortedByEfficiency = [...routePerformance].sort((a, b) => a.costPerKm - b.costPerKm);
    const mostEfficientRoute = sortedByEfficiency.length > 0 ? sortedByEfficiency[0].routeName : 'N/A';

    this.summaryStats.set({ totalCost, overallOnTime, totalTrips, mostEfficientRoute });
  }

  private prepareVisuals(
    costs: CollectorCostReport[],
    routePerformance: RoutePerformanceReport[]
  ): void {
    // Chart: Top 7 routes by total cost
    const chartResult = [...routePerformance]
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 7)
      .map(item => ({ name: item.routeName, value: item.totalCost }));
    this.chartData.set(chartResult);
    
    // Table 1: Top 5 most costly collectors
    this.topCostlyCollectors.set(
      costs.sort((a, b) => b.totalCost - a.totalCost).slice(0, 5)
    );

    // Table 2: Top 5 least efficient routes (highest cost per km)
    this.leastEfficientRoutes.set(
      routePerformance.sort((a, b) => b.costPerKm - a.costPerKm).slice(0, 5)
    );
  }
  
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
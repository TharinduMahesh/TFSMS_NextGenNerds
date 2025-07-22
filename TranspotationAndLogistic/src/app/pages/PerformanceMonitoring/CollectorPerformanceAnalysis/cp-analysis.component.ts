import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Models and Services
import { CollectorPerformanceReport } from '../../../models/Logistic and Transport/TransportReports.model';
import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';
import { TransportReportService } from '../../../services/LogisticAndTransport/TransportReport.service';
import { CollectorService } from '../../../services/LogisticAndTransport/Collector.service';
import { PNavbarComponent } from "../../../components/pnav bar/pnav.component ";

// We'll create an enriched type for our component's state
type EnrichedPerformanceReport = CollectorPerformanceReport & { vehicleCondition?: string };

@Component({
  selector: 'app-collector-performance-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxChartsModule, DecimalPipe, PNavbarComponent],
  templateUrl: './cp-analysis.component.html',
  styleUrls: ['./cp-analysis.component.scss']
})
export class CollectorPerformanceAnalysisComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);
  private collectorService = inject(CollectorService);

  reportForm: FormGroup;
  
  reportData = signal<EnrichedPerformanceReport[]>([]);
  chartData = signal<{ name: string, value: number }[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // --- Summary Card Signals ---
  averageOnTimePercentage = signal<number>(0);
  topPerformer = signal<EnrichedPerformanceReport | null>(null);
  bottomPerformer = signal<EnrichedPerformanceReport | null>(null);

  // ngx-charts options for Horizontal Bar Chart
  view: [number, number] = [0, 400];
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'On-Time Departure Percentage';
  showYAxisLabel = true;
  yAxisLabel = 'Collector';
  colorScheme: Color = {
    name: 'performance',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28a745', '#ffc107', '#dc3545'], // Green, Yellow, Red
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
    this.reportData.set([]);

    const { startDate, endDate } = this.reportForm.value;

    // Use forkJoin to fetch performance report AND collector details (for vehicle notes)
    forkJoin({
      performance: this.reportService.getPerformanceByCollector(startDate, endDate),
      collectors: this.collectorService.getAllCollectors() // You might need to add a full Vehicle service call here if collector doesn't include vehicle details
    }).pipe(
      map(({ performance, collectors }) => {
        const collectorVehicleMap = new Map(collectors.map(c => [c.collectorId, c.vehicleConditionNotes])); // Placeholder
        // Enrich the performance data with vehicle condition notes
        return performance.map(p => ({
          ...p,
          vehicleCondition: collectorVehicleMap.get(p.collectorId) || 'No vehicle data'
        }));
      })
    ).subscribe({
      next: (enrichedData) => {
        // Sort data by performance for ranking
        const sortedData = enrichedData.sort((a, b) => b.onTimePercentage - a.onTimePercentage);
        this.reportData.set(sortedData);
        
        // Prepare data for the chart
        this.chartData.set(sortedData.map(item => ({
          name: item.collectorName,
          value: item.onTimePercentage
        })));
        
        this.calculateSummaries(sortedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  private calculateSummaries(data: EnrichedPerformanceReport[]): void {
    if (data.length === 0) {
      // Reset all summaries
      return;
    }
    
    const totalPercentage = data.reduce((sum, item) => sum + item.onTimePercentage, 0);
    this.averageOnTimePercentage.set(totalPercentage / data.length);
    
    // Data is sorted, so first and last are top and bottom performers
    this.topPerformer.set(data[0]);
    this.bottomPerformer.set(data[data.length - 1]);
  }
}
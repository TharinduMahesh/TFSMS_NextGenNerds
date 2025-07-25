import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// --- Note: Ensure component/model/service paths are correct for your project ---
import { PNavbarComponent } from '../../../components/pnav bar/pnav.component';
import { CollectorPerformanceReport } from '../../../models/Logistic and Transport/TransportReports.model';
import { CollectorService } from '../../../services/LogisticAndTransport/Collector.service';
import { TransportReportService } from '../../../services/LogisticAndTransport/TransportReport.service';

type EnrichedPerformanceReport = CollectorPerformanceReport & { vehicleCondition?: string };

@Component({
  selector: 'app-collector-performance-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxChartsModule, DecimalPipe, PNavbarComponent],
  templateUrl: './cp-analysis.component.html',
  styleUrls: ['./cp-analysis.component.scss']
})
export class CollectorPerformanceAnalysisComponent implements OnInit {
  // --- Injections and Form Setup ---
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);
  private collectorService = inject(CollectorService);
  reportForm: FormGroup;
  
  // --- State and Data Signals ---
  reportData = signal<EnrichedPerformanceReport[]>([]);
  chartData = signal<{ name: string, value: number }[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  averageOnTimePercentage = signal<number>(0);
  topPerformer = signal<EnrichedPerformanceReport | null>(null);
  bottomPerformer = signal<EnrichedPerformanceReport | null>(null);

  // --- ngx-charts options ---
  view: [number, number] = [800, 400];
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  
  xAxisLabel = 'Collector';                     
  yAxisLabel = 'On-Time Departure Percentage';  
  
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

    const { startDate, endDate } = this.reportForm.value;

    forkJoin({
      performance: this.reportService.getPerformanceByCollector(startDate, endDate),
      collectors: this.collectorService.getAllCollectors() 
    }).pipe(
      map(({ performance, collectors }) => {
        const collectorVehicleMap = new Map(collectors.map(c => [c.collectorId, c.vehicleLicensePlate]));
        return performance.map(p => ({
          ...p,
          vehicleCondition: `Assigned: ${collectorVehicleMap.get(p.collectorId) || 'None'}`
        }));
      })
    ).subscribe({
      next: (enrichedData) => {
        const sortedData = enrichedData.sort((a, b) => b.onTimePercentage - a.onTimePercentage);
        this.reportData.set(sortedData);
        this.chartData.set(sortedData.map(item => ({ name: item.collectorName, value: item.onTimePercentage })));
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
      this.averageOnTimePercentage.set(0);
      this.topPerformer.set(null);
      this.bottomPerformer.set(null);
      return;
    }
    
    const totalPercentage = data.reduce((sum, item) => sum + item.onTimePercentage, 0);
    this.averageOnTimePercentage.set(totalPercentage / data.length);
    
    this.topPerformer.set(data[0]);
    this.bottomPerformer.set(data[data.length - 1]);
  }
}
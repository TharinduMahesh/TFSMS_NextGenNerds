import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and Services
import { CollectorPerformanceReport } from '../../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../../Services/LogisticAndTransport/TransportReport.service';
import { PNavbarComponent } from "../../../../components/pnav bar/pnav.component";

@Component({
  selector: 'app-collector-performance-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PNavbarComponent],
  templateUrl: './c-p-report.component.html',
  styleUrls: ['./c-p-report.component.scss']
})
export class CollectorPerformanceReportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);

  reportForm: FormGroup;
  
  reportData = signal<CollectorPerformanceReport[] | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

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
    // Generate the report on initial load with default dates
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
    // Don't reset reportData to null here, it causes a flicker. 
    // The loading state is enough to inform the user.

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getPerformanceByCollector(startDate, endDate).subscribe({
      next: (data) => {
        // Sort data by performance (highest first) for better analysis
        const sortedData = data.sort((a, b) => b.onTimePercentage - a.onTimePercentage);
        this.reportData.set(sortedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate the performance report.');
        this.isLoading.set(false);
        this.reportData.set([]); // Set to empty array on error to clear old data
      }
    });
  }

  // --- NEW CSV EXPORT FUNCTIONALITY ---
  exportToCsv(): void {
    const data = this.reportData();
    if (!data || data.length === 0) {
      alert('No data available to export.');
      return;
    }

    // 1. Define CSV Headers
    const headers = [
      "Collector ID",
      "Collector Name",
      "Total Trips Completed",
      "On-Time Trips",
      "On-Time Percentage"
    ];

    // 2. Convert data rows to CSV format
    const csvRows = data.map(row => 
      [
        row.collectorId,
        `"${row.collectorName}"`, // Enclose name in quotes to handle commas
        row.totalTripsCompleted,
        row.onTimeTrips,
        row.onTimePercentage
      ].join(',')
    );

    // 3. Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const todayStr = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `collector-performance-report_${todayStr}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
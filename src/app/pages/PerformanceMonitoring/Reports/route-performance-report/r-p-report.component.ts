import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common'; // Import needed pipes
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Models and Services
import { RoutePerformanceReport } from '../../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../../Services/LogisticAndTransport/TransportReport.service';
import { PNavbarComponent } from "../../../../components/pnav bar/pnav.component";

@Component({
  selector: 'app-route-performance-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DecimalPipe,
    CurrencyPipe,
    PNavbarComponent
],
  templateUrl: './r-p-report.component.html',
  styleUrls: ['./r-p-report.component.scss']
})
export class RoutePerformanceReportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);

  reportForm: FormGroup;
  
  reportData = signal<RoutePerformanceReport[] | null>(null);
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
    // NOTE: We no longer set reportData to null here to prevent the UI from flickering.

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getPerformanceByRoute(startDate, endDate).subscribe({
      next: (data) => {
        // Sort data to show highest cost-per-km routes first for better analysis
        const sortedData = data.sort((a, b) => b.costPerKm - a.costPerKm);
        this.reportData.set(sortedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate the route performance report.');
        this.isLoading.set(false);
        this.reportData.set([]); // Set to empty on error to clear old data
      }
    });
  }

  // --- NEW: CSV EXPORT FUNCTIONALITY ---
  exportToCsv(): void {
    const data = this.reportData();
    if (!data || data.length === 0) {
      alert('No data is available to export.');
      return;
    }

    // 1. Define CSV Headers to match the table
    const headers = [
      "Route ID",
      "Route Name",
      "Total Trips",
      "Average Trip Duration (Hours)",
      "On-Time Departure Percentage",
      "Total Cost (LKR)",
      "Cost per Km (LKR)"
    ];

    // 2. Convert each row of data into a CSV-formatted string
    const csvRows = data.map(row =>
      [
        row.routeId,
        `"${row.routeName.replace(/"/g, '""')}"`, // Enclose in quotes and handle existing quotes
        row.totalTrips,
        row.averageTripDurationHours,
        row.onTimeDeparturePercentage,
        row.totalCost,
        row.costPerKm
      ].join(',')
    );

    // 3. Combine the headers and the rows, separated by newline characters
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // 4. Create a Blob (Binary Large Object) and trigger a browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const reportDate = this.formatDate(new Date());
      link.setAttribute("href", url);
      link.setAttribute("download", `route-performance-report_${reportDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
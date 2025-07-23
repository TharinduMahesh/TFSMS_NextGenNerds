import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common'; // Import needed pipes
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Models and Services
import { RoutePerformanceReport } from '../../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../../services/LogisticAndTransport/TransportReport.service';
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
    // Initialize the form with default date values (e.g., the last month)
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.reportForm = this.fb.group({
      startDate: [this.formatDate(oneMonthAgo), Validators.required],
      endDate: [this.formatDate(today), Validators.required]
    });
  }
  
  // ngOnInit is a great place to generate an initial report
  ngOnInit(): void {
      this.generateReport();
  }

  // Helper function to format a Date object into 'YYYY-MM-DD' for the input control
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Method called by the form submission
  generateReport(): void {
    if (this.reportForm.invalid) {
      alert('Please select both a start and end date.');
      return;
    }
    
    this.isLoading.set(true);
    this.error.set(null);
    this.reportData.set(null); // Clear previous results before fetching new ones

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getPerformanceByRoute(startDate, endDate).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate the route performance report.');
        this.isLoading.set(false);
      }
    });
  }
}
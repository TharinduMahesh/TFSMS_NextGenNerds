import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and Services
import { CollectorCostReport } from '../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../Services/LogisticAndTransport/TransportReport.service';
import { PNavbarComponent } from "../../../components/pnav bar/pnav.component";

@Component({
  selector: 'app-cost-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PNavbarComponent],
  templateUrl: './ct-report.component.html',
  styleUrls: ['./ct-report.component.scss']
})
export class CostReportComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(TransportReportService);

  // Form group for date pickers
  reportForm: FormGroup;
  
  // Signals for managing state
  reportData = signal<CollectorCostReport[] | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    // Initialize the form with default date values
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.reportForm = this.fb.group({
      startDate: [this.formatDate(oneMonthAgo), Validators.required],
      endDate: [this.formatDate(today), Validators.required]
    });
  }
  ngOnInit(): void {
    this.generateReport(); // Call generateReport on page load
  }

  // Helper function to format date as 'YYYY-MM-DD' for the date input
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
    this.reportData.set(null); // Clear previous results

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getCostByCollector(startDate, endDate).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate the cost report.');
        this.isLoading.set(false);
      }
    });
  }
}
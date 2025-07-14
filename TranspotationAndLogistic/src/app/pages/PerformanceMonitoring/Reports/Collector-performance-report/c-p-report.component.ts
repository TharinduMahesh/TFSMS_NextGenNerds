import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Models and Services
import { CollectorPerformanceReport } from '../../../../models/Logistic and Transport/TransportReports.model';
import { TransportReportService } from '../../../../services/LogisticAndTransport/TransportReport.service';

@Component({
  selector: 'app-collector-performance-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './c-p-report.component.html',
  styleUrls: ['./c-p-report.component.scss']
})
export class CollectorPerformanceReportComponent {
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
    this.reportData.set(null);

    const { startDate, endDate } = this.reportForm.value;

    this.reportService.getPerformanceByCollector(startDate, endDate).subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate the performance report.');
        this.isLoading.set(false);
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../Services/report.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Report } from '../../../models/report.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dahsboard.component.html',
  styleUrls: ['./dahsboard.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class DashboardComponent implements OnInit {
  dispatchIDs: string[] = [];
  yields = ['More than 500', 'Less than 500'];
  statuses = ['Delivered', 'In Transit'];
  selectedDispatchID = 'All Dispatch IDs';
  selectedYield = 'All Yield';
  selectedStatus = 'All Statuses';
  selectedDate = '';

  reports: Report[] = [];
  filteredReports: Report[] = [];
  showEditModal = false;
  editingReport: Report | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.updateDispatchIDs();
        this.filterReports();
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        if (typeof window !== 'undefined') {
          alert(error.message); // Now shows proper error message
        }
      }
    });
  }

  updateDispatchIDs(): void {
    const uniqueIDs = [...new Set(this.reports.map(report => report.dispatchID))];
    this.dispatchIDs = uniqueIDs.sort();
  }

  filterReports(): void {
    this.filteredReports = this.reports.filter(report => {
      const matchesDispatchID = this.selectedDispatchID === 'All Dispatch IDs' || 
                               report.dispatchID === this.selectedDispatchID;

      const matchesYield = this.selectedYield === 'All Yield' ||
                          (this.selectedYield === 'More than 500' && report.bagCount > 500) ||
                          (this.selectedYield === 'Less than 500' && report.bagCount <= 500);

      const matchesStatus = this.selectedStatus === 'All Statuses' || 
                           report.status === this.selectedStatus;

      let matchesDate = true;
      if (this.selectedDate) {
        const reportDate = new Date(report.date).toISOString().split('T')[0];
        matchesDate = reportDate === this.selectedDate;
      }

      return matchesDispatchID && matchesYield && matchesStatus && matchesDate;
    });
  }

  editReport(report: Report): void {
    this.editingReport = { ...report };
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (this.editingReport) {
      this.reportService.updateReport(this.editingReport).subscribe({
        next: () => {
          this.loadReports();
          this.showEditModal = false;
          this.editingReport = null;
        },
        error: (error) => {
          console.error('Error updating report:', error);
          alert('Failed to update report. Please try again.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.showEditModal = false;
    this.editingReport = null;
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.deleteReport(id);
    }
  }

  private deleteReport(id: number): void {
    this.reportService.deleteReport(id).subscribe({
      next: () => {
        this.loadReports();
      },
      error: (error) => {
        console.error('Error deleting report:', error);
        if (typeof window !== 'undefined'){
        alert('Failed to delete report. Please try again.');
        }
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
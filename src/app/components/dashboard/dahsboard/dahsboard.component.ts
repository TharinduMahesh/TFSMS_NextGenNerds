import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../Services/report.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Report {
  dispatchID: string;
  yield: string;
  bagCount: number;
  vehicleNumber: string;
  driverNIC: string;
  date: string;
  status: 'Delivered' | 'In Transit';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dahsboard.component.html', // Ensure this path is correct
  styleUrls: ['./dahsboard.component.css'], // Ensure this path is correct
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule] // Import necessary modules
})
export class DashboardComponent implements OnInit {
  dispatchIDs = ['All Dispatch IDs', 'D-001', 'D-002', 'D-003'];
  yields = ['All Yield', 'More than 500', 'Less than 500'];
  statuses = ['All Statuses', 'Delivered', 'In Transit'];
  selectedDispatchID = 'All Dispatch IDs';
  selectedYield = 'All Yield';
  selectedStatus = 'All Statuses';
  selectedDate = '';

  reports: Report[] = [];
  filteredReports: Report[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe(data => {
      this.reports = data;
      this.filterReports();
    });
  }

  filterReports(): void {
    this.filteredReports = this.reports.filter(report => {
      const matchesDispatchID = this.selectedDispatchID === 'All Dispatch IDs' || report.dispatchID === this.selectedDispatchID;
      const matchesYield = this.selectedYield === 'All Yield' ||
                           (this.selectedYield === 'More than 500' && report.bagCount > 500) ||
                           (this.selectedYield === 'Less than 500' && report.bagCount <= 500);
      const matchesStatus = this.selectedStatus === 'All Statuses' || report.status === this.selectedStatus;
      const matchesDate = !this.selectedDate || new Date(report.date).toISOString().split('T')[0] === this.selectedDate;

      return matchesDispatchID && matchesYield && matchesStatus && matchesDate;
    });
  }

  editReport(report: Report): void {
    console.log('Edit report:', report);
    this.reportService.updateReport(report).subscribe(() => {
      this.loadReports();
    });
  }

  deleteReport(dispatchID: string): void {
    this.reportService.deleteReport(dispatchID).subscribe(() => {
      this.loadReports();
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'delivered';
      case 'In Transit':
        return 'in-transit';
      default:
        return '';
    }
  }
}

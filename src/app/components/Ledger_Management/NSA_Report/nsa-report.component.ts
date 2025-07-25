// src/app/components/nsa-report/nsa-report.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from "../../header/header.component";

import { NsaReportService } from '../../../Services/nsa-report.service'; // NEW: Import the service
import { NsaEntry } from '../../../models/nsa-entry.interface'; // Import the updated NsaEntry interface

@Component({
  selector: 'app-nsa-report', // Renamed selector
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './nsa-report.component.html', // Renamed template file
  styleUrls: ['./nsa-report.component.css'] // Renamed CSS file
})
export class NsaReportComponent implements OnInit {

  // --- Report Filter Properties ---
  startDate: string = '2023-01-01'; // Default to a wide historical range
  endDate: string = new Date().toISOString().split('T')[0]; // Default to today's date

  // --- Report Data Properties ---
  allNsaRecords: NsaEntry[] = []; // Stores all fetched NSA report entries
  filteredNsaRecords: NsaEntry[] = []; // Stores NSA entries after applying filters

  // --- Constructor and Initialization ---
  constructor(
    private router: Router,
    private nsaReportService: NsaReportService, // NEW: Inject the NSA Report Service
    @Inject(PLATFORM_ID) private platformId: Object // For browser-specific checks
  ) {}

  ngOnInit(): void {
    // Load NSA report data when the component initializes
    this.loadNsaReport();
  }

  /**
   * @method loadNsaReport
   * @description Fetches NSA report data from the backend using the NsaReportService.
   * Applies filters after data is loaded.
   */
  loadNsaReport(): void {
    this.nsaReportService.getNsaReports(this.startDate, this.endDate).subscribe({
      next: (data) => {
        // Map data to ensure proper types and formatting for display
        this.allNsaRecords = data.map(entry => ({
          ...entry,
          // Ensure entryDate is in YYYY-MM-DD format for date inputs if needed,
          // or formatted for display as desired. Backend already sends DateTime.
          entryDate: new Date(entry.entryDate).toISOString().split('T')[0],
          // Ensure numbers are numbers, etc. (TypeScript handles this with interface)
        })).sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()); // Sort by date ascending

        console.log('NSA Report records loaded:', this.allNsaRecords);
        this.applyFilters(); // Apply filters (which might just be displaying all loaded data initially)
      },
      error: (error) => {
        console.error('Error loading NSA report:', error);
        if (isPlatformBrowser(this.platformId)) {
          alert('Failed to load NSA report. Please check backend connections.');
        }
      }
    });
  }

  /**
   * @method applyFilters
   * @description Applies filters to the NSA report data.
   * Currently, this just copies all loaded data to filteredNsaRecords,
   * but can be expanded for more complex client-side filtering.
   */
  applyFilters(): void {
    // For now, client-side filtering is simple based on the date range fetched.
    // If you add more filters to the HTML (e.g., specific tea grades),
    // you would add more filtering logic here.
    this.filteredNsaRecords = [...this.allNsaRecords];
  }

  /**
   * @method clearFilters
   * @description Resets the date filters to their default wide range and reloads the report.
   */
  clearFilters(): void {
    this.startDate = '2023-01-01';
    this.endDate = new Date().toISOString().split('T')[0];
    this.loadNsaReport(); // Reload data with cleared filters
  }

  /**
   * @method formatDate
   * @description Utility function to format date strings for display.
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(); // For display
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  /**
   * @method exportToCsv
   * @description Exports the currently filtered NSA report data to a CSV file.
   */
  exportToCsv(): void {
    if (this.filteredNsaRecords.length === 0) {
      if (isPlatformBrowser(this.platformId)) {
        alert('No data to export.');
      }
      return;
    }

    // Define CSV headers based on your table columns
    const headers = [
      'Entry No.', 'Entry Date', 'Monthly Kilos Sold', 'Proceeds',
      'Adjusted Kilos', 'Adjusted Proceeds', 'NSA Value'
    ];

    // Map your filteredNsaRecords data to CSV rows
    const csvRows = this.filteredNsaRecords.map(record => {
      const escapeCsv = (value: any): string => {
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      };

      return [
        escapeCsv(record.id),
        escapeCsv(this.formatDate(record.entryDate)), // Use formatDate for consistent date export
        escapeCsv(record.monthlyKilosSold),
        escapeCsv(record.proceeds),
        escapeCsv(record.adjustedKilos),
        escapeCsv(record.adjustedProceeds),
        escapeCsv(record.nsaValue)
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows
    ].join('\n');

    // Create a Blob from the CSV content and trigger download
    if (isPlatformBrowser(this.platformId)) {
      const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `nsa_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.warn('CSV export is not supported in server-side rendering.');
    }
  }

  /**
   * @method exitPage
   * @description Navigates the user back to the ledger management page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

// src/app/features/denatured-tea-report/denatured-tea-report.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { DenaturedTeaReportRecord } from '../../models/Ledger Management/denatured-t-report.model';

@Injectable({
  providedIn: 'root'
})
export class DenaturedTeaReportService {
  // --- State ---
  // Holds the complete, unfiltered list of records.
  private allRecords = signal<DenaturedTeaReportRecord[]>([]);

  // Signals to hold the current filter values.
  public selectedGrade = signal<string>('All');
  public selectedReason = signal<string>('All');
  public selectedDate = signal<string>('');

  // --- Computed Data ---
  // A computed signal that reactively filters the records whenever a filter changes.
  public filteredRecords = computed(() => {
    const records = this.allRecords();
    const grade = this.selectedGrade();
    const reason = this.selectedReason();
    const date = this.selectedDate();

    return records.filter(record => {
      const gradeMatch = (grade === 'All') || record.teaGrade === grade;
      const reasonMatch = (reason === 'All') || record.reason === reason;
      const dateMatch = !date || record.date === date;
      return gradeMatch && reasonMatch && dateMatch;
    });
  });
  
  // Computes the unique options for the filter dropdowns from the full dataset.
  public teaGradeOptions = computed(() => ['All', ...new Set(this.allRecords().map(r => r.teaGrade))]);
  public reasonOptions = computed(() => ['All', ...new Set(this.allRecords().map(r => r.reason))]);

  constructor() {
    this.loadInitialData();
  }

  // Populates the service with mock data. In a real app, this would be an HTTP call.
  private loadInitialData(): void {
    const mockData: DenaturedTeaReportRecord[] = [
      { id: 1, date: '2024-01-01', teaGrade: 'BOP', quantity: 100, reason: 'Low Quality' },
      { id: 2, date: '2024-01-02', teaGrade: 'FBOP', quantity: 50, reason: 'Excess Moisture' },
      { id: 3, date: '2024-01-03', teaGrade: 'BOPF', quantity: 200, reason: 'Low Quality' },
      { id: 4, date: '2024-01-03', teaGrade: 'BOP', quantity: 75, reason: 'Expired' },
    ];
    this.allRecords.set(mockData);
  }
}
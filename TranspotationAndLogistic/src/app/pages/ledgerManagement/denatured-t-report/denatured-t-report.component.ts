// src/app/features/denatured-tea-report/denatured-tea-report.component.ts

import { Component, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenaturedTeaReportService } from '../../../services/LedgerManagement/denatured-t-report.service';

@Component({
  selector: 'app-denatured-tea-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './denatured-t-report.component.html',
  styleUrls: ['./denatured-t-report.component.scss']
})
export class DenaturedTeaReportComponent {
  private reportService = inject(DenaturedTeaReportService);

  // --- Component-local signals for form bindings ---
  gradeFilter = signal('All');
  reasonFilter = signal('All');
  dateFilter = signal('');

  // --- Data from the service ---
  records = this.reportService.filteredRecords;
  teaGradeOptions = this.reportService.teaGradeOptions;
  reasonOptions = this.reportService.reasonOptions;

  constructor() {
    // An effect that runs whenever a local filter signal changes.
    // It updates the service, which in turn causes the `filteredRecords` to recompute.
    effect(() => {
      this.reportService.selectedGrade.set(this.gradeFilter());
      this.reportService.selectedReason.set(this.reasonFilter());
      this.reportService.selectedDate.set(this.dateFilter());
    });
  }

  onExit(): void {
    console.log('Exit action triggered.');
    // In a real app, use the Angular Router to navigate.
  }
}
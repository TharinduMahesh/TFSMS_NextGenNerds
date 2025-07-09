// src/app/features/return-register/return-register.component.ts

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReturnRegisterService } from '../../../services/LedgerManagement/r-register.service';

@Component({
  selector: 'app-return-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './r-register.component.html',
  styleUrls: ['./r-register.component.scss']
})
export class ReturnRegisterComponent {
  private registerService = inject(ReturnRegisterService);

  // --- Local signals for form bindings ---
  dateFilter = signal('');
  seasonFilter = signal('');
  reasonFilter = signal('');
  invoiceFilter = signal('');

  // --- Data from the service ---
  records = this.registerService.filteredRecords;

  // --- Component Methods ---
  onApplyFilter(): void {
    this.registerService.applyFilters({
      date: this.dateFilter(),
      season: this.seasonFilter(),
      reason: this.reasonFilter(),
      invoice: this.invoiceFilter()
    });
  }

  onExit(): void {
    console.log('Exit action triggered.');
  }
}
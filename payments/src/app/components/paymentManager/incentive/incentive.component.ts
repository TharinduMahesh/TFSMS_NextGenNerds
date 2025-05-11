import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Incentive } from '../../../models/incentive.model';
import { Supplier } from '../../../models/supplier.model';
import { IncentiveService } from '../../../shared/services/incentive.service';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ExportService } from '../../../shared/services/export.service';

@Component({
  selector: 'app-incentive',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css']
})
export class IncentiveComponent implements OnInit {
  incentives: Incentive[] = [];
  filteredIncentives: Incentive[] = [];
  suppliers: Supplier[] = [];
  selectedSupplier: string = '';
  selectedMonth: string = '';
  incentiveForm: FormGroup;
  
  totalIncentives: number = 0;
  totalQualityBonus: number = 0;
  totalLoyaltyBonus: number = 0;
  
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private incentiveService: IncentiveService,
    private supplierService: SupplierService,
    private exportService: ExportService,
    private fb: FormBuilder
  ) {
    this.incentiveForm = this.fb.group({
      SupplierId: ['', Validators.required],
      month: [new Date().toISOString().split('T')[0].substring(0, 7), Validators.required],
      qualityBonus: [0, [Validators.required, Validators.min(0)]],
      loyaltyBonus: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    // Update total amount when quality or loyalty bonus changes
    this.incentiveForm.get('qualityBonus')?.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });

    this.incentiveForm.get('loyaltyBonus')?.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
  }

  ngOnInit(): void {
    this.loadIncentives();
    this.loadSuppliers();
    this.loadSummaryMetrics();
  }

  updateTotalAmount(): void {
    const qualityBonus = this.incentiveForm.get('qualityBonus')?.value || 0;
    const loyaltyBonus = this.incentiveForm.get('loyaltyBonus')?.value || 0;
    // No need to set a form control, just calculate when needed
  }

  loadIncentives(): void {
    this.loading = true;
    this.error = null;

    this.incentiveService.getAllIncentives().subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.incentives = data;
          this.filteredIncentives = [...data];
        } else {
          console.error('Expected array but got:', typeof data);
          this.incentives = [];
          this.filteredIncentives = [];
          this.error = 'Invalid data format received from server';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incentives:', err);
        this.error = 'Failed to load incentives. Please try again later.';
        this.loading = false;
        this.incentives = [];
        this.filteredIncentives = [];
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.suppliers = data;
        } else {
          console.error('Expected array but got:', typeof data);
          this.suppliers = [];
        }
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.suppliers = [];
      }
    });
  }

  loadSummaryMetrics(): void {
    this.incentiveService.getTotalIncentivesCount().subscribe({
      next: (total) => {
        this.totalIncentives = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalIncentives = 0;
      }
    });

    this.incentiveService.getTotalQualityBonusAmount().subscribe({
      next: (total) => {
        this.totalQualityBonus = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalQualityBonus = 0;
      }
    });

    this.incentiveService.getTotalLoyaltyBonusAmount().subscribe({
      next: (total) => {
        this.totalLoyaltyBonus = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalLoyaltyBonus = 0;
      }
    });
  }

  filterIncentives(): void {
    if (!Array.isArray(this.incentives)) {
      this.filteredIncentives = [];
      return;
    }
    
    this.filteredIncentives = this.incentives.filter(incentive => {
      const supplierMatch = !this.selectedSupplier || incentive.SupplierId.toString() === this.selectedSupplier;
      const monthMatch = !this.selectedMonth || (incentive.month && incentive.month.includes(this.selectedMonth));
      return supplierMatch && monthMatch;
    });
  }

  addIncentive(): void {
    if (this.incentiveForm.invalid) {
      this.markFormGroupTouched(this.incentiveForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValues = this.incentiveForm.value;
    const incentive: Incentive = {
      incentiveId: 0,
      SupplierId: formValues.SupplierId,
      month: formValues.month,
      qualityBonus: formValues.qualityBonus,
      loyaltyBonus: formValues.loyaltyBonus,
      totalAmount: formValues.qualityBonus + formValues.loyaltyBonus,
      notes: formValues.notes,
      createdDate: new Date()
    };

    this.incentiveService.createIncentive(incentive).subscribe({
      next: (result) => {
        this.loadIncentives();
        this.loadSummaryMetrics();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding incentive:', err);
        this.error = 'Failed to add incentive. Please try again.';
        this.loading = false;
      }
    });
  }

  exportIncentivesData(format: string): void {
    this.loading = true;

    this.exportService.exportIncentives(format).subscribe({
      next: (blob) => {
        const filename = `incentives-export.${format.toLowerCase()}`;
        this.exportService.downloadFile(blob, filename);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error exporting incentives:', err);
        this.error = 'Failed to export incentives. Please try again.';
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.incentiveForm.reset({
      month: new Date().toISOString().split('T')[0].substring(0, 7),
      qualityBonus: 0,
      loyaltyBonus: 0,
      notes: ''
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
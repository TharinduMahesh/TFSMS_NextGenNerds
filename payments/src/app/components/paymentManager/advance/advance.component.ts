import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Advance } from '../../../models/advance.model';
import { Supplier } from '../../../models/supplier.model';
import { AdvanceService } from '../../../shared/services/advance.service';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ExportService } from '../../../shared/services/export.service';

@Component({
  selector: 'app-advance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {
  advances: Advance[] = [];
  filteredAdvances: Advance[] = [];
  suppliers: Supplier[] = [];
  advanceTypes: string[] = ['All', 'Cash', 'Material', 'Other'];
  selectedType: string = 'All';
  selectedSupplier: string = '';
  advanceForm: FormGroup;
  
  totalAdvances: number = 0;
  totalOutstandingAmount: number = 0;
  totalRecoveredAmount: number = 0;
  
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private advanceService: AdvanceService,
    private supplierService: SupplierService,
    private exportService: ExportService,
    private fb: FormBuilder
  ) {
    this.advanceForm = this.fb.group({
      SupplierId: ['', Validators.required],
      advanceType: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      issueDate: [new Date().toISOString().split('T')[0], Validators.required],
      recoveredAmount: [0],
      balanceAmount: [{value: '', disabled: true}, [Validators.required, Validators.min(0)]],
      recoveryPercentage: [30, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    // Update balance amount when amount or recovered amount changes
    this.advanceForm.get('amount')?.valueChanges.subscribe(value => {
      this.updateBalanceAmount();
    });

    this.advanceForm.get('recoveredAmount')?.valueChanges.subscribe(value => {
      this.updateBalanceAmount();
    });
  }

  ngOnInit(): void {
    this.loadAdvances();
    this.loadSuppliers();
    this.loadSummaryMetrics();
  }

  updateBalanceAmount(): void {
    const amount = this.advanceForm.get('amount')?.value || 0;
    const recoveredAmount = this.advanceForm.get('recoveredAmount')?.value || 0;
    const balanceAmount = amount - recoveredAmount;
    
    this.advanceForm.get('balanceAmount')?.setValue(balanceAmount >= 0 ? balanceAmount : 0);
  }

  loadAdvances(): void {
    this.loading = true;
    this.error = null;

    this.advanceService.getAllAdvances().subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.advances = data;
          this.filteredAdvances = [...data];
        } else {
          console.error('Expected array but got:', typeof data);
          this.advances = [];
          this.filteredAdvances = [];
          this.error = 'Invalid data format received from server';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading advances:', err);
        this.error = 'Failed to load advances. Please try again later.';
        this.loading = false;
        this.advances = [];
        this.filteredAdvances = [];
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
    this.advanceService.getTotalAdvancesCount().subscribe({
      next: (total) => {
        this.totalAdvances = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalAdvances = 0;
      }
    });

    this.advanceService.getTotalOutstandingAmount().subscribe({
      next: (total) => {
        this.totalOutstandingAmount = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalOutstandingAmount = 0;
      }
    });

    this.advanceService.getTotalRecoveredAmount().subscribe({
      next: (total) => {
        this.totalRecoveredAmount = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalRecoveredAmount = 0;
      }
    });
  }

  filterAdvances(): void {
    if (!Array.isArray(this.advances)) {
      this.filteredAdvances = [];
      return;
    }
    
    this.filteredAdvances = this.advances.filter(advance => {
      const typeMatch = this.selectedType === 'All' || advance.advanceType === this.selectedType;
      const supplierMatch = !this.selectedSupplier || advance.SupplierId.toString() === this.selectedSupplier;
      return typeMatch && supplierMatch;
    });
  }

  addAdvance(): void {
    if (this.advanceForm.invalid) {
      this.markFormGroupTouched(this.advanceForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValues = this.advanceForm.value;
    const balanceAmount = formValues.amount - formValues.recoveredAmount;
    
    const advance: Advance = {
      advanceId: 0,
      SupplierId: formValues.SupplierId,
      advanceType: formValues.advanceType,
      description: formValues.description,
      amount: formValues.amount,
      issueDate: new Date(formValues.issueDate),
      recoveredAmount: formValues.recoveredAmount,
      balanceAmount: balanceAmount,
      recoveryPercentage: formValues.recoveryPercentage,
      status: balanceAmount > 0 ? 'Active' : 'Settled'
    };

    this.advanceService.createAdvance(advance).subscribe({
      next: (result) => {
        this.loadAdvances();
        this.loadSummaryMetrics();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding advance:', err);
        this.error = 'Failed to add advance. Please try again.';
        this.loading = false;
      }
    });
  }

  exportAdvancesData(format: string): void {
    this.loading = true;

    this.exportService.exportAdvances(format).subscribe({
      next: (blob) => {
        const filename = `advances-export.${format.toLowerCase()}`;
        this.exportService.downloadFile(blob, filename);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error exporting advances:', err);
        this.error = 'Failed to export advances. Please try again.';
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.advanceForm.reset({
      advanceType: '',
      issueDate: new Date().toISOString().split('T')[0],
      recoveredAmount: 0,
      recoveryPercentage: 30
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
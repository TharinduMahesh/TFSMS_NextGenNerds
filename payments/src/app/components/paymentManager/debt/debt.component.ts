import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Debt } from '../../../models/debt.model';
import { Supplier } from '../../../models/supplier.model';
import { DebtService } from '../../../shared/services/debt.service';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ExportService } from '../../../shared/services/export.service';

@Component({
  selector: 'app-debt',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css']
})
export class DebtComponent implements OnInit {
  debts: Debt[] = [];
  filteredDebts: Debt[] = [];
  suppliers: Supplier[] = [];
  debtTypes: string[] = ['All', 'Loan', 'Equipment', 'Other'];
  selectedType: string = 'All';
  selectedSupplier: string = '';
  debtForm: FormGroup;
  
  totalDebts: number = 0;
  totalOutstandingAmount: number = 0;
  totalDeductionsMade: number = 0;
  
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private debtService: DebtService,
    private supplierService: SupplierService,
    private exportService: ExportService,
    private fb: FormBuilder
  ) {
    this.debtForm = this.fb.group({
      supplierId: ['', Validators.required],
      debtType: ['', Validators.required],
      description: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0.01)]],
      issueDate: [new Date().toISOString().split('T')[0], Validators.required],
      deductionsMade: [0],
      balanceAmount: [{value: '', disabled: true}, [Validators.required, Validators.min(0)]],
      deductionPercentage: [20, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    // Update balance amount when total amount or deductions change
    this.debtForm.get('totalAmount')?.valueChanges.subscribe(value => {
      this.updateBalanceAmount();
    });

    this.debtForm.get('deductionsMade')?.valueChanges.subscribe(value => {
      this.updateBalanceAmount();
    });
  }

  ngOnInit(): void {
    this.loadDebts();
    this.loadSuppliers();
    this.loadSummaryMetrics();
  }

  updateBalanceAmount(): void {
    const totalAmount = this.debtForm.get('totalAmount')?.value || 0;
    const deductionsMade = this.debtForm.get('deductionsMade')?.value || 0;
    const balanceAmount = totalAmount - deductionsMade;
    
    this.debtForm.get('balanceAmount')?.setValue(balanceAmount >= 0 ? balanceAmount : 0);
  }

  loadDebts(): void {
    this.loading = true;
    this.error = null;

    this.debtService.getAllDebts().subscribe({
      next: (data) => {
        this.debts = data;
        this.filteredDebts = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading debts:', err);
        this.error = 'Failed to load debts. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
      }
    });
  }

  loadSummaryMetrics(): void {
    this.debtService.getTotalDebtsCount().subscribe({
      next: (total) => {
        this.totalDebts = total;
      }
    });

    this.debtService.getTotalOutstandingAmount().subscribe({
      next: (total) => {
        this.totalOutstandingAmount = total;
      }
    });

    this.debtService.getTotalDeductionsMade().subscribe({
      next: (total) => {
        this.totalDeductionsMade = total;
      }
    });
  }

  filterDebts(): void {
    this.filteredDebts = this.debts.filter(debt => {
      const typeMatch = this.selectedType === 'All' || debt.debtType === this.selectedType;
      const supplierMatch = !this.selectedSupplier || debt.supplierId.toString() === this.selectedSupplier;
      return typeMatch && supplierMatch;
    });
  }

  addDebt(): void {
    if (this.debtForm.invalid) {
      this.markFormGroupTouched(this.debtForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValues = this.debtForm.value;
    const balanceAmount = formValues.totalAmount - formValues.deductionsMade;
    
    const debt: Debt = {
      debtId: 0,
      supplierId: formValues.supplierId,
      debtType: formValues.debtType,
      description: formValues.description,
      totalAmount: formValues.totalAmount,
      issueDate: new Date(formValues.issueDate),
      deductionsMade: formValues.deductionsMade,
      balanceAmount: balanceAmount,
      deductionPercentage: formValues.deductionPercentage,
      status: balanceAmount > 0 ? 'Active' : 'Settled'
    };

    this.debtService.createDebt(debt).subscribe({
      next: (result) => {
        this.loadDebts();
        this.loadSummaryMetrics();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding debt:', err);
        this.error = 'Failed to add debt. Please try again.';
        this.loading = false;
      }
    });
  }

  exportDebtsData(format: string): void {
    this.loading = true;

    this.exportService.exportDebts(format).subscribe({
      next: (blob) => {
        const filename = `debts-export.${format.toLowerCase()}`;
        this.exportService.downloadFile(blob, filename);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error exporting debts:', err);
        this.error = 'Failed to export debts. Please try again.';
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.debtForm.reset({
      debtType: '',
      issueDate: new Date().toISOString().split('T')[0],
      deductionsMade: 0,
      deductionPercentage: 20
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
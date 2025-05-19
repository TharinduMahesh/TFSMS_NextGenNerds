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
  
  totalDebts = 0;
  totalOutstandingAmount = 0;
  totalDeductionsMade = 0;
  
  loading = false;
  error: string | null = null;

  constructor(
    private debtService: DebtService,
    private supplierService: SupplierService,
    private exportService: ExportService,
    private fb: FormBuilder
  ) {
    this.debtForm = this.fb.group({
      SupplierId: ['', Validators.required],
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

  // Add this method to normalize the data
  private normalizeDebtData(debts: any[]): Debt[] {
    return debts.map((debt) => {
      // Handle both camelCase and PascalCase property names
      return {
        debtId: debt.debtId || debt.DebtId || 0,
        SupplierId: debt.SupplierId || debt.supplierId || 0,
        SupplierName: debt.SupplierName || debt.supplierName || '',
        debtType: debt.debtType || debt.DebtType || '',
        description: debt.description || debt.Description || '',
        totalAmount: debt.totalAmount || debt.TotalAmount || 0,
        balanceAmount: debt.balanceAmount || debt.BalanceAmount || 0,
        deductionsMade: debt.deductionsMade || debt.DeductionsMade || 0,
        deductionPercentage: debt.deductionPercentage || debt.DeductionPercentage || 0,
        status: debt.status || debt.Status || 'Active',
        issueDate: debt.issueDate || debt.IssueDate,
        createdBy: debt.createdBy || debt.CreatedBy || '',
        createdDate: debt.createdDate || debt.CreatedDate || new Date(),
        Supplier: debt.Supplier || debt.supplier,
      }
    })
  }

  loadDebts(): void {
    this.loading = true;
    this.error = null;

    this.debtService.getAllDebts().subscribe({
      next: (data) => {
        console.log("Raw debts data:", data);
        
        // Ensure data is an array
        const debtsArray = Array.isArray(data) ? data : [];

        // Normalize the data to ensure consistent property names
        this.debts = this.normalizeDebtData(debtsArray);
        console.log("Normalized debts:", this.debts);

        this.filteredDebts = [...this.debts];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading debts:', err);
        this.error = 'Failed to load debts. Please try again later.';
        this.loading = false;
        this.debts = [];
        this.filteredDebts = [];
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
    this.debtService.getTotalDebtsCount().subscribe({
      next: (total) => {
        this.totalDebts = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalDebts = 0;
      }
    });

    this.debtService.getTotalOutstandingAmount().subscribe({
      next: (total) => {
        this.totalOutstandingAmount = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalOutstandingAmount = 0;
      }
    });

    this.debtService.getTotalDeductionsMade().subscribe({
      next: (total) => {
        this.totalDeductionsMade = typeof total === 'number' ? total : 0;
      },
      error: () => {
        this.totalDeductionsMade = 0;
      }
    });
  }

  filterDebts(): void {
    if (!Array.isArray(this.debts)) {
      this.filteredDebts = [];
      return;
    }
    
    this.filteredDebts = this.debts.filter(debt => {
      const typeMatch = this.selectedType === 'All' || debt.debtType === this.selectedType;
      const supplierMatch = !this.selectedSupplier || debt.SupplierId.toString() === this.selectedSupplier;
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
      SupplierId: formValues.SupplierId,
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
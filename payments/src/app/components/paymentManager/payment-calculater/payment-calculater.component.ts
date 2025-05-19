import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supplier } from '../../../models/supplier.model';
import { Advance } from '../../../models/advance.model';
import { Debt } from '../../../models/debt.model';
import { Incentive } from '../../../models/incentive.model';
import { PaymentCalculationResult } from '../../../models/payment-calculation.model';
import { SupplierService } from '../../../shared/services/supplier.service';
import { GreenLeafService } from '../../../shared/services/green-leaf.service';
import { AdvanceService } from '../../../shared/services/advance.service';
import { DebtService } from '../../../shared/services/debt.service';
import { IncentiveService } from '../../../shared/services/incentive.service';

@Component({
  selector: 'app-payment-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-calculater.component.html',
  styleUrls: ['./payment-calculater.component.css']
})
export class PaymentCalculatorComponent implements OnInit, OnChanges {
  @Input() suppliers: Supplier[] = [];
  @Input() initialSupplierId: string = '';
  @Input() initialLeafWeight: number = 0;
  @Input() initialRate: number = 200;
  @Output() calculationComplete = new EventEmitter<PaymentCalculationResult>();

  calculatorForm: FormGroup;
  advances: Advance[] = [];
  debts: Debt[] = [];
  incentives: Incentive[] = [];

  calculationResult: PaymentCalculationResult | null = null;

  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private greenLeafService: GreenLeafService,
    private advanceService: AdvanceService,
    private debtService: DebtService,
    private incentiveService: IncentiveService
  ) {
    this.calculatorForm = this.fb.group({
      SupplierId: ['', Validators.required],
      leafWeight: ['', [Validators.required, Validators.min(0.01)]],
      rate: [200, [Validators.required, Validators.min(0.01)]],
      includeAdvances: [true],
      includeDebts: [true],
      includeIncentives: [true],
      advanceAmount: [0],
      debtAmount: [0],
      qualityBonus: [0],
      loyaltyBonus: [0]
    });
  }

  ngOnInit(): void {
    if (!this.suppliers || this.suppliers.length === 0) {
      this.loadSuppliers();
    }
    
    this.updateFormWithInitialValues();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSupplierId'] || changes['initialLeafWeight'] || changes['initialRate']) {
      this.updateFormWithInitialValues();
    }
    
    if (changes['suppliers'] && this.suppliers && this.suppliers.length > 0) {
      // Suppliers were provided externally
      if (this.initialSupplierId) {
        this.onSupplierChange();
      }
    }
  }
  
  private updateFormWithInitialValues(): void {
    const updates: any = {};
    
    if (this.initialSupplierId) {
      updates.SupplierId = this.initialSupplierId;
    }
    
    if (this.initialLeafWeight) {
      updates.leafWeight = this.initialLeafWeight;
    }
    
    if (this.initialRate) {
      updates.rate = this.initialRate;
    }
    
    if (Object.keys(updates).length > 0) {
      this.calculatorForm.patchValue(updates);
      
      if (this.initialSupplierId) {
        this.onSupplierChange();
      }
    }
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
          this.error = 'Invalid supplier data format received from server';
        }
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.error = 'Failed to load suppliers. Please try again.';
        this.suppliers = [];
      }
    });
  }

  onSupplierChange(): void {
    const SupplierId = this.calculatorForm.get('SupplierId')?.value;
    if (!SupplierId) return;

    this.loading = true;

    // Get the latest green leaf weight for this supplier
    this.greenLeafService.getLatestGreenLeafWeight(SupplierId).subscribe({
      next: (weight) => {
        if (weight > 0 && !this.initialLeafWeight) {
          this.calculatorForm.patchValue({ leafWeight: weight });
        }
      },
      error: (err) => console.error('Error loading green leaf data:', err)
    });

    // Load supplier advances
    this.advanceService.getAdvancesBySupplier(SupplierId).subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.advances = data;
          const totalAdvances = data.reduce((sum, advance) => sum + advance.BalanceAmount, 0);
          this.calculatorForm.patchValue({ advanceAmount: totalAdvances });
        } else {
          console.error('Expected array but got:', typeof data);
          this.advances = [];
          this.calculatorForm.patchValue({ advanceAmount: 0 });
        }
      },
      error: (err) => {
        console.error('Error loading advances:', err);
        this.advances = [];
        this.calculatorForm.patchValue({ advanceAmount: 0 });
      }
    });

    // Load supplier debts
    this.debtService.getDebtsBySupplier(SupplierId).subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.debts = data;
          const totalDebts = data.reduce((sum, debt) => sum + debt.balanceAmount, 0);
          this.calculatorForm.patchValue({ debtAmount: totalDebts });
        } else {
          console.error('Expected array but got:', typeof data);
          this.debts = [];
          this.calculatorForm.patchValue({ debtAmount: 0 });
        }
      },
      error: (err) => {
        console.error('Error loading debts:', err);
        this.debts = [];
        this.calculatorForm.patchValue({ debtAmount: 0 });
      }
    });

    // Load supplier incentives
    this.incentiveService.getCurrentIncentiveForSupplier(SupplierId).subscribe({
      next: (data) => {
        if (data) {
          this.incentives = [data];
          this.calculatorForm.patchValue({
            qualityBonus: data.QualityBonus,
            loyaltyBonus: data.LoyaltyBonus
          });
        } else {
          this.incentives = [];
          this.calculatorForm.patchValue({
            qualityBonus: 0,
            loyaltyBonus: 0
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incentives:', err);
        this.incentives = [];
        this.calculatorForm.patchValue({
          qualityBonus: 0,
          loyaltyBonus: 0
        });
        this.loading = false;
      }
    });
  }

  calculatePayment(): void {
    if (this.calculatorForm.invalid) {
      this.markFormGroupTouched(this.calculatorForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValues = this.calculatorForm.value;
    const leafWeight = formValues.leafWeight;
    const rate = formValues.rate;

    // Calculate gross amount
    const grossAmount = leafWeight * rate;

    // Calculate deductions
    let advanceDeduction = 0;
    let debtDeduction = 0;

    if (formValues.includeAdvances) {
      advanceDeduction = formValues.advanceAmount;
    }

    if (formValues.includeDebts) {
      debtDeduction = formValues.debtAmount;
    }

    // Calculate incentives
    let incentiveAddition = 0;

    if (formValues.includeIncentives) {
      incentiveAddition = formValues.qualityBonus + formValues.loyaltyBonus;
    }

    // Calculate net amount
    const netAmount = grossAmount - advanceDeduction - debtDeduction + incentiveAddition;

    // Set calculation result
    this.calculationResult = {
      grossAmount: grossAmount,
      advanceDeduction: advanceDeduction,
      debtDeduction: debtDeduction,
      incentiveAddition: incentiveAddition,
      netAmount: netAmount > 0 ? netAmount : 0
    };
    
    // Emit the result to parent component
    this.calculationComplete.emit(this.calculationResult);

    this.loading = false;
  }
  
  useCalculationValues(): void {
    if (this.calculationResult) {
      this.calculationComplete.emit(this.calculationResult);
    }
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
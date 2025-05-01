import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment } from '../../models/payment.model';
import { Supplier } from '../../models/supplier.model';
import { PaymentService } from '../../shared/services/payment.service';
import { SupplierService } from '../../shared/services/supplier.service';
import { GreenLeafService } from '../../shared/services/green-leaf.service';
import { AdvanceService } from '../../shared/services/advance.service';
import { DebtService } from '../../shared/services/debt.service';
import { IncentiveService } from '../../shared/services/incentive.service';
import { ReceiptService } from '../../shared/services/reciept.service';
import { ExportService } from '../../shared/services/export.service';
import { PaymentCalculationRequest, PaymentCalculationResult } from '../../models/payment-calculation.model';
import { PaymentCalculatorComponent } from '../payment-calculater/payment-calculater.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaymentCalculatorComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  suppliers: Supplier[] = [];
  paymentMethods: string[] = ['All', 'Cash', 'Bank Transfer', 'Cheque'];
  selectedMethod: string = 'All';
  selectedDate: string = '';
  paymentForm: FormGroup;
  
  totalPayments: number = 0;
  totalCash: number = 0;
  totalBankTransfer: number = 0;
  totalCheques: number = 0;
  
  loading: boolean = false;
  error: string | null = null;
  showCalculator: boolean = false;
  calculationResult: PaymentCalculationResult | null = null;

  constructor(
    private paymentService: PaymentService,
    private supplierService: SupplierService,
    private greenLeafService: GreenLeafService,
    private advanceService: AdvanceService,
    private debtService: DebtService,
    private incentiveService: IncentiveService,
    private receiptService: ReceiptService,
    private exportService: ExportService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      supplierId: ['', Validators.required],
      leafWeight: ['', [Validators.required, Validators.min(0.01)]],
      rate: [200, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required],
      advanceDeduction: [0],
      debtDeduction: [0],
      incentiveAddition: [0]
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.loadSuppliers();
    this.loadSummaryMetrics();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = null;

    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.filteredPayments = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = 'Failed to load payments. Please try again later.';
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

  onSupplierChange(event: any): void {
    const supplierId = event.target.value;
    if (!supplierId) return;

    this.loading = true;

    this.greenLeafService.getLatestGreenLeafWeight(supplierId).subscribe({
      next: (weight) => {
        if (weight > 0) {
          this.paymentForm.patchValue({ leafWeight: weight });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading green leaf data:', err);
        this.loading = false;
      }
    });

    this.loadSupplierFinancialData(supplierId);
  }

  loadSupplierFinancialData(supplierId: number): void {
    this.advanceService.getAdvancesBySupplier(supplierId).subscribe({
      next: (advances) => {
        const totalAdvances = advances.reduce((sum, adv) => sum + adv.balanceAmount, 0);
        this.paymentForm.patchValue({ advanceDeduction: totalAdvances });
      },
      error: (err) => console.error('Error loading advances:', err)
    });

    this.debtService.getDebtsBySupplier(supplierId).subscribe({
      next: (debts) => {
        const totalDebts = debts.reduce((sum, debt) => sum + (debt.balanceAmount - debt.deductionsMade), 0);
        this.paymentForm.patchValue({ debtDeduction: totalDebts });
      },
      error: (err) => console.error('Error loading debts:', err)
    });

    this.incentiveService.getCurrentIncentiveForSupplier(supplierId).subscribe({
      next: (incentive) => {
        if (incentive) {
          const totalIncentive = incentive.qualityBonus + incentive.loyaltyBonus;
          this.paymentForm.patchValue({ incentiveAddition: totalIncentive });
        }
      },
      error: (err) => console.error('Error loading incentives:', err)
    });
  }

  loadSummaryMetrics(): void {
    this.paymentService.getTotalPaymentsAmount().subscribe({
      next: (total) => {
        this.totalPayments = this.payments.length;
      }
    });

    this.paymentService.getTotalPaymentsByMethod('Cash').subscribe({
      next: (total) => {
        this.totalCash = total;
      }
    });

    this.paymentService.getTotalPaymentsByMethod('Bank Transfer').subscribe({
      next: (total) => {
        this.totalBankTransfer = total;
      }
    });

    this.paymentService.getTotalPaymentsByMethod('Cheque').subscribe({
      next: (total) => {
        this.totalCheques = total;
      }
    });
  }

  filterPayments(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const methodMatch = this.selectedMethod === 'All' || payment.paymentMethod === this.selectedMethod;
      const dateMatch = !this.selectedDate || payment.paymentDate.toString().includes(this.selectedDate);
      return methodMatch && dateMatch;
    });
  }

  toggleCalculator(): void {
    this.showCalculator = !this.showCalculator;
  }

  handleCalculationResult(result: PaymentCalculationResult): void {
    this.calculationResult = result;
    
    // Update the payment form with calculation results
    this.paymentForm.patchValue({
      advanceDeduction: result.advanceDeduction,
      debtDeduction: result.debtDeduction,
      incentiveAddition: result.incentiveAddition
    });
    
    // Optionally hide calculator after applying values
    // this.showCalculator = false;
  }

  addPayment(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValues = this.paymentForm.value;
    const grossAmount = formValues.leafWeight * formValues.rate;
    const netAmount = grossAmount - formValues.advanceDeduction - formValues.debtDeduction + formValues.incentiveAddition;

    const payment: Payment = {
      ...formValues,
      paymentId: 0,
      grossAmount: grossAmount,
      netAmount: netAmount,
      paymentDate: new Date(formValues.paymentDate)
    };

    this.paymentService.createPayment(payment).subscribe({
      next: (result) => {
        this.loadPayments();
        this.loadSummaryMetrics();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding payment:', err);
        this.error = 'Failed to add payment. Please try again.';
        this.loading = false;
      }
    });
  }

  printReceipt(payment: Payment): void {
    this.receiptService.printReceipt(payment);
  }

  downloadReceipt(payment: Payment): void {
    this.receiptService.downloadReceiptPDF(payment).subscribe({
      next: (blob) => {
        const filename = `receipt-${payment.paymentId}.pdf`;
        this.exportService.downloadFile(blob, filename);
      },
      error: (err) => {
        console.error('Error downloading receipt:', err);
        this.error = 'Failed to download receipt. Please try again.';
      }
    });
  }

  exportPaymentsData(format: string): void {
    this.loading = true;

    this.exportService.exportPayments(format).subscribe({
      next: (blob) => {
        const filename = `payments-export.${format.toLowerCase()}`;
        this.exportService.downloadFile(blob, filename);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error exporting payments:', err);
        this.error = 'Failed to export payments. Please try again.';
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.paymentForm.reset({
      rate: 200,
      paymentDate: new Date().toISOString().split('T')[0],
      advanceDeduction: 0,
      debtDeduction: 0,
      incentiveAddition: 0
    });
    this.calculationResult = null;
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
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment } from '../../models/payment.model';
// import { Supplier } from '../../models/supplier.model';
import { PaymentService } from '../../shared/services/payment.service';
import { SupplierService } from '../../shared/services/supplier.service';
import { PaymentCalculationRequest, PaymentCalculationResult } from '../../models/payment-calculation.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  suppliers: Supplier[] = [];
  paymentMethods: string[] = ['All', 'Cash', 'Bank Transfer', 'Cheque'];
  selectedMethod: string = 'All';
  selectedDate: string = '';
  
  paymentForm: FormGroup;
  calculationForm: FormGroup;
  calculationResult: PaymentCalculationResult | null = null;
  
  totalPayments: number = 0;
  totalCash: number = 0;
  totalBankTransfer: number = 0;
  totalCheques: number = 0;
  
  loading: boolean = false;
  error: string | null = null;
  showCalculator: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private supplierService: SupplierService,
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
    
    this.calculationForm = this.fb.group({
      supplierId: ['', Validators.required],
      leafWeight: ['', [Validators.required, Validators.min(0.01)]],
      rate: [200, [Validators.required, Validators.min(0.01)]],
      includeAdvances: [true],
      includeDebts: [true],
      includeIncentives: [true],
      advanceDeductionLimit: [0.3],
      debtDeductionLimit: [0.2]
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
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
      }
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

  calculatePayment(): void {
    if (this.calculationForm.invalid) {
      this.markFormGroupTouched(this.calculationForm);
      return;
    }
    
    this.loading = true;
    const request: PaymentCalculationRequest = this.calculationForm.value;
    
    this.paymentService.calculatePayment(request).subscribe({
      next: (result) => {
        this.calculationResult = result;
        this.loading = false;
        
        // Update payment form with calculation results
        this.paymentForm.patchValue({
          supplierId: request.supplierId,
          leafWeight: request.leafWeight,
          rate: request.rate,
          advanceDeduction: result.advanceDeduction,
          debtDeduction: result.debtDeduction,
          incentiveAddition: result.incentiveAddition
        });
      },
      error: (err) => {
        console.error('Error calculating payment:', err);
        this.error = 'Failed to calculate payment. Please try again.';
        this.loading = false;
      }
    });
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

  toggleCalculator(): void {
    this.showCalculator = !this.showCalculator;
    if (this.showCalculator) {
      // Copy values from payment form to calculator form
      const paymentFormValues = this.paymentForm.value;
      this.calculationForm.patchValue({
        supplierId: paymentFormValues.supplierId,
        leafWeight: paymentFormValues.leafWeight,
        rate: paymentFormValues.rate
      });
    }
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
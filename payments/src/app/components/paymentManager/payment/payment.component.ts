import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment } from '../../../models/payment.model';
import { Supplier } from '../../../models/supplier.model';
import { PaymentService } from '../../../shared/services/payment.service';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ReceiptService } from '../../../shared/services/reciept.service';
import { PaymentCalculatorComponent } from '../payment-calculater/payment-calculater.component';
import { PaymentCalculationResult } from '../../../models/payment-calculation.model';

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
  paymentForm: FormGroup;
  
  totalPayments: number = 0;
  totalAmount: number = 0;
  paymentsByCash: number = 0;
  paymentsByBank: number = 0;
  paymentsByCheque: number = 0;
  
  selectedSupplier: string = '';
  selectedDateRange: string = 'all';
  customStartDate: string = '';
  customEndDate: string = '';
  
  showCalculator: boolean = false;
  calculationResult: PaymentCalculationResult | null = null;
  
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private supplierService: SupplierService,
    private receiptService: ReceiptService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      supplierId: ['', Validators.required],
      leafWeight: ['', [Validators.required, Validators.min(0.01)]],
      rate: [200, [Validators.required, Validators.min(0.01)]],
      grossAmount: [{value: 0, disabled: true}],
      advanceDeduction: [0],
      debtDeduction: [0],
      incentiveAddition: [0],
      netAmount: [{value: 0, disabled: true}],
      paymentMethod: ['Cash', Validators.required],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });

    // Update gross amount when leaf weight or rate changes
    this.paymentForm.get('leafWeight')?.valueChanges.subscribe(() => this.updateGrossAmount());
    this.paymentForm.get('rate')?.valueChanges.subscribe(() => this.updateGrossAmount());
    
    // Update net amount when deductions or additions change
    this.paymentForm.get('advanceDeduction')?.valueChanges.subscribe(() => this.updateNetAmount());
    this.paymentForm.get('debtDeduction')?.valueChanges.subscribe(() => this.updateNetAmount());
    this.paymentForm.get('incentiveAddition')?.valueChanges.subscribe(() => this.updateNetAmount());
  }

  ngOnInit(): void {
    this.loadPayments();
    this.loadSuppliers();
    this.loadSummaryMetrics();
  }

  updateGrossAmount(): void {
    const leafWeight = this.paymentForm.get('leafWeight')?.value || 0;
    const rate = this.paymentForm.get('rate')?.value || 0;
    const grossAmount = leafWeight * rate;
    
    this.paymentForm.get('grossAmount')?.setValue(grossAmount);
    this.updateNetAmount();
  }

  updateNetAmount(): void {
    const grossAmount = this.paymentForm.get('grossAmount')?.value || 0;
    const advanceDeduction = this.paymentForm.get('advanceDeduction')?.value || 0;
    const debtDeduction = this.paymentForm.get('debtDeduction')?.value || 0;
    const incentiveAddition = this.paymentForm.get('incentiveAddition')?.value || 0;
    
    const netAmount = grossAmount - advanceDeduction - debtDeduction + incentiveAddition;
    this.paymentForm.get('netAmount')?.setValue(netAmount > 0 ? netAmount : 0);
  }

  loadPayments(): void {
    this.loading = true;
    this.error = null;

    this.paymentService.getPayments().subscribe({
      next: (data) => {
        // Ensure data is an array
        this.payments = Array.isArray(data) ? data : [];
        this.filteredPayments = [...this.payments];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = 'Failed to load payments. Please try again later.';
        this.loading = false;
        // Initialize with empty arrays to prevent errors
        this.payments = [];
        this.filteredPayments = [];
      }
    });
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
        // Ensure data is an array
        this.suppliers = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error loading suppliers:', err);
        this.suppliers = [];
      }
    });
  }

  loadSummaryMetrics(): void {
    this.paymentService.getTotalPaymentsCount().subscribe({
      next: (total) => {
        this.totalPayments = total;
      },
      error: (err) => {
        console.error('Error loading payments count:', err);
        this.totalPayments = 0;
      }
    });

    this.paymentService.getTotalPaymentsAmount().subscribe({
      next: (total) => {
        this.totalAmount = total;
      },
      error: (err) => {
        console.error('Error loading total payments amount:', err);
        this.totalAmount = 0;
      }
    });

    this.paymentService.getTotalPaymentsByMethod('Cash').subscribe({
      next: (total) => {
        this.paymentsByCash = total;
      },
      error: (err) => {
        console.error('Error loading cash payments:', err);
        this.paymentsByCash = 0;
      }
    });

    this.paymentService.getTotalPaymentsByMethod('Bank Transfer').subscribe({
      next: (total) => {
        this.paymentsByBank = total;
      },
      error: (err) => {
        console.error('Error loading bank transfer payments:', err);
        this.paymentsByBank = 0;
      }
    });

    this.paymentService.getTotalPaymentsByMethod('Cheque').subscribe({
      next: (total) => {
        this.paymentsByCheque = total;
      },
      error: (err) => {
        console.error('Error loading cheque payments:', err);
        this.paymentsByCheque = 0;
      }
    });
  }

  filterPayments(): void {
    let filtered = [...this.payments];
    
    // Filter by supplier
    if (this.selectedSupplier) {
      filtered = filtered.filter(payment => 
        payment.supplierId.toString() === this.selectedSupplier
      );
    }
    
    // Filter by date range
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (this.selectedDateRange === 'today') {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startOfToday;
      });
    } else if (this.selectedDateRange === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startOfWeek;
      });
    } else if (this.selectedDateRange === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startOfMonth;
      });
    } else if (this.selectedDateRange === 'custom' && this.customStartDate && this.customEndDate) {
      const startDate = new Date(this.customStartDate);
      const endDate = new Date(this.customEndDate);
      endDate.setHours(23, 59, 59); // Include the entire end date
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }
    
    this.filteredPayments = filtered;
  }

  toggleCalculator(): void {
    this.showCalculator = !this.showCalculator;
  }

  onCalculationComplete(result: PaymentCalculationResult): void {
    this.calculationResult = result;
    
    // Update form with calculation results
    this.paymentForm.patchValue({
      grossAmount: result.grossAmount,
      advanceDeduction: result.advanceDeduction,
      debtDeduction: result.debtDeduction,
      incentiveAddition: result.incentiveAddition,
      netAmount: result.netAmount
    });
    
    // Hide calculator after using values
    this.showCalculator = false;
  }

  createPayment(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    this.loading = true;
    this.error = null;

    // Get form values
    const formValues = this.paymentForm.getRawValue(); // Get disabled fields too
    
    // Create payment object
    const payment: Payment = {
      paymentId: 0, // New payment
      supplierId: formValues.supplierId,
      leafWeight: formValues.leafWeight,
      rate: formValues.rate,
      grossAmount: formValues.grossAmount,
      advanceDeduction: formValues.advanceDeduction,
      debtDeduction: formValues.debtDeduction,
      incentiveAddition: formValues.incentiveAddition,
      netAmount: formValues.netAmount,
      paymentMethod: formValues.paymentMethod,
      paymentDate: new Date(formValues.paymentDate),
      createdBy: 'System', // This would come from auth service in a real app
      createdDate: new Date(),
      supplier: null, // Will be populated by backend
      receipts: [],
      // paymentHistories: []
    };

    this.paymentService.createPayment(payment).subscribe({
      next: (result) => {
        // Refresh data
        this.loadPayments();
        this.loadSummaryMetrics();
        
        // Reset form
        this.resetForm();
        
        // Show success message
        this.error = null;
        this.loading = false;
        
        // Generate receipt
        this.generateReceipt(result);
      },
      error: (err) => {
        console.error('Error creating payment:', err);
        this.error = 'Failed to create payment. Please try again.';
        this.loading = false;
      }
    });
  }

  generateReceipt(payment: Payment): void {
    this.receiptService.printReceipt(payment);
  }

  exportPayments(format: string): void {
    let startDate = '';
    let endDate = '';
    
    if (this.selectedDateRange === 'custom') {
      startDate = this.customStartDate;
      endDate = this.customEndDate;
    }
    
    this.paymentService.exportPayments(format, startDate, endDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-export.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.error('Error exporting payments:', err);
        this.error = 'Failed to export payments. Please try again.';
      }
    });
  }

  private resetForm(): void {
    this.paymentForm.reset({
      supplierId: '',
      leafWeight: '',
      rate: 200,
      grossAmount: 0,
      advanceDeduction: 0,
      debtDeduction: 0,
      incentiveAddition: 0,
      netAmount: 0,
      paymentMethod: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
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
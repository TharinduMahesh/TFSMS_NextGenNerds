

// import { Component, OnInit } from '@angular/core';
// import { Payment } from '../models/payment.model';
// import { PaymentService } from '../services/payment.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-payment',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css']
// })
// export class PaymentComponent implements OnInit {
//   payments: Payment[] = [
//     { paymentId: 101, supplierId: 234, amount: 250, paymentMethod: 'Cash', paymentDate: '2024-12-18' },
//     { paymentId: 102, supplierId: 345, amount: 500, paymentMethod: 'Bank Transfer', paymentDate: '2024-12-19' },
//   ];

//   paymentMethods: string[] = ['All', 'Bank Transfer', 'Cash', 'Cheques'];
//   selectedMethod: string = 'All';
//   selectedDate: string = '';
//   filteredPayments: Payment[] = [];
  
//   // Summary metrics
//   totalPayments: number = 0;
//   totalBankTransfer: number = 0;
//   totalCash: number = 0;
//   totalCheques: number = 0;

//   // New Payment Fields
//   newPayment: Payment = { paymentId: 0, supplierId: 0, amount: 0, paymentMethod: '', paymentDate: '' };

//   constructor() {
//     this.calculateSummaryMetrics();
//   }

//   ngOnInit() {
//     this.filteredPayments = this.payments;
//     this.calculateSummaryMetrics();
//   }

//   calculateSummaryMetrics() {
//     this.totalPayments = this.payments.length;
//     this.totalBankTransfer = this.payments
//       .filter(p => p.paymentMethod === 'Bank Transfer')
//       .reduce((sum, p) => sum + p.amount, 0);
//     this.totalCash = this.payments
//       .filter(p => p.paymentMethod === 'Cash')
//       .reduce((sum, p) => sum + p.amount, 0);
//       this.totalCheques = this.payments
//       .filter(p => p.paymentMethod === 'Cheques') 
//       .reduce((sum, p) => sum + p.amount,0);
//   }

//   filterPayments() {
//     this.filteredPayments = this.payments.filter(payment => {
//       const methodMatch = this.selectedMethod === 'All' || payment.paymentMethod === this.selectedMethod;
//       const dateMatch = !this.selectedDate || payment.paymentDate === this.selectedDate;
//       return methodMatch && dateMatch;
//     });
//   }

//   addPayment() {
//     if (this.validatePayment()) {
//       // Create a new payment object to avoid reference issues
//       const paymentToAdd = { ...this.newPayment };
      
//       // Add the payment to the array
//       this.payments.push(paymentToAdd);
      
//       // Update the filtered payments and metrics
//       this.filterPayments();
//       this.calculateSummaryMetrics();
      
//       // Reset the form
//       this.resetForm();
//     }
//   }

//   private validatePayment(): boolean {
//     return !!(
//       this.newPayment.paymentId &&
//       this.newPayment.supplierId &&
//       this.newPayment.amount &&
//       this.newPayment.paymentMethod &&
//       this.newPayment.paymentDate
//     );
//   }

//   private resetForm() {
//     this.newPayment = {
//       paymentId: 0,
//       supplierId: 0,
//       amount: 0,
//       paymentMethod: '',
//       paymentDate: ''
//     };
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Payment } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  paymentMethods: string[] = ['All', 'Bank Transfer', 'Cash', 'Cheques'];
  selectedMethod: string = 'All';
  selectedDate: string = '';
  filteredPayments: Payment[] = [];
  
  // Summary metrics
  totalPayments: number = 0;
  totalBankTransfer: number = 0;
  totalCash: number = 0;
  totalCheques: number = 0;

  // New Payment Fields
  newPayment: Payment = { 
    paymentId: 0, 
    supplierId: 0, 
    amount: 0, 
    paymentMethod: '', 
    paymentDate: new Date().toISOString().split('T')[0] 
  };

  // Error handling
  error: string | null = null;
  loading: boolean = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.error = null;
    
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.filteredPayments = data;
        this.calculateSummaryMetrics();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.error = 'Failed to load payments. Please try again later.';
        this.loading = false;
      }
    });
  }

  calculateSummaryMetrics() {
    this.totalPayments = this.payments.length;
    this.totalBankTransfer = this.payments
      .filter(p => p.paymentMethod === 'Bank Transfer')
      .reduce((sum, p) => sum + p.amount, 0);
    this.totalCash = this.payments
      .filter(p => p.paymentMethod === 'Cash')
      .reduce((sum, p) => sum + p.amount, 0);
    this.totalCheques = this.payments
      .filter(p => p.paymentMethod === 'Cheques') 
      .reduce((sum, p) => sum + p.amount, 0);
  }

  filterPayments() {
    this.filteredPayments = this.payments.filter(payment => {
      const methodMatch = this.selectedMethod === 'All' || payment.paymentMethod === this.selectedMethod;
      const dateMatch = !this.selectedDate || payment.paymentDate === this.selectedDate;
      return methodMatch && dateMatch;
    });
  }

  addPayment() {
    if (this.validatePayment()) {
      this.loading = true;
      this.error = null;

      this.paymentService.addPayment(this.newPayment).subscribe({
        next: (response) => {
          this.payments.push(response);
          this.filterPayments();
          this.calculateSummaryMetrics();
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding payment:', error);
          this.error = 'Failed to add payment. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  private validatePayment(): boolean {
    if (!this.newPayment.supplierId || this.newPayment.supplierId <= 0) {
      this.error = 'Please enter a valid Supplier ID';
      return false;
    }
    if (!this.newPayment.amount || this.newPayment.amount <= 0) {
      this.error = 'Please enter a valid amount';
      return false;
    }
    if (!this.newPayment.paymentMethod) {
      this.error = 'Please select a payment method';
      return false;
    }
    if (!this.newPayment.paymentDate) {
      this.error = 'Please select a payment date';
      return false;
    }
    return true;
  }

  private resetForm() {
    this.newPayment = {
      paymentId: 0,
      supplierId: 0,
      amount: 0,
      paymentMethod: '',
      paymentDate: new Date().toISOString().split('T')[0]
    };
    this.error = null;
  }
}

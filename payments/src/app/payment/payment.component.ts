// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Component, OnInit } from '@angular/core';
// import { Payment } from '../models/payment.model';
// import { PaymentService } from '../services/payment.service';



// @Component({
//   selector: 'app-payment',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css']
// })
// export class PaymentComponent implements OnInit {
//   payments: Payment[] = [
//     { paymentId: 101, supplierId: 234, amount: 250, paymentMethod: 'Cash', paymentDate: '18-Dec-2024' },
//     { paymentId: 101, supplierId: 345, amount: 250, paymentMethod: 'Bank Transfer', paymentDate: '18-Dec-2024' },
//     { paymentId: 101, supplierId: 789, amount: 250, paymentMethod: 'Cash', paymentDate: '18-Dec-2024' },
//     { paymentId: 101, supplierId: 890, amount: 250, paymentMethod: 'Cash', paymentDate: '18-Dec-2024' },
//     { paymentId: 101, supplierId: 456, amount: 250, paymentMethod: 'Bank Transfer', paymentDate: '18-Dec-2024' },
//     { paymentId: 101, supplierId: 123, amount: 250, paymentMethod: 'Cash', paymentDate: '18-Dec-2024' },
//   ];

//   paymentMethods: string[] = ['All', 'Bank Transfer', 'Cash', 'Cheques'];
//   selectedMethod: string = 'All';
//   filteredPayments: Payment[] = [];

//   ngOnInit() {
//     this.filteredPayments = this.payments;
//   }

//   filterPayments() {
//     if (this.selectedMethod === 'All') {
//       this.filteredPayments = this.payments;
//     } else {
//       this.filteredPayments = this.payments.filter(payment => payment.paymentMethod === this.selectedMethod);
//     }
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
  payments: Payment[] = [
    { paymentId: 101, supplierId: 234, amount: 250, paymentMethod: 'Cash', paymentDate: '2024-12-18' },
    { paymentId: 102, supplierId: 345, amount: 500, paymentMethod: 'Bank Transfer', paymentDate: '2024-12-19' },
  ];

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
  newPayment: Payment = { paymentId: 0, supplierId: 0, amount: 0, paymentMethod: '', paymentDate: '' };

  constructor() {
    this.calculateSummaryMetrics();
  }

  ngOnInit() {
    this.filteredPayments = this.payments;
    this.calculateSummaryMetrics();
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
      .reduce((sum, p) => sum + p.amount,0);
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
      // Create a new payment object to avoid reference issues
      const paymentToAdd = { ...this.newPayment };
      
      // Add the payment to the array
      this.payments.push(paymentToAdd);
      
      // Update the filtered payments and metrics
      this.filterPayments();
      this.calculateSummaryMetrics();
      
      // Reset the form
      this.resetForm();
    }
  }

  private validatePayment(): boolean {
    return !!(
      this.newPayment.paymentId &&
      this.newPayment.supplierId &&
      this.newPayment.amount &&
      this.newPayment.paymentMethod &&
      this.newPayment.paymentDate
    );
  }

  private resetForm() {
    this.newPayment = {
      paymentId: 0,
      supplierId: 0,
      amount: 0,
      paymentMethod: '',
      paymentDate: ''
    };
  }
}


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
  
  totalPayments: number = 0;
  totalBankTransfer: number = 0;
  totalCash: number = 0;
  totalCheques: number = 0;

  newPayment: Payment = { paymentId: 0, supplierId: 0, amount: 0, paymentMethod: '', paymentDate: '' };

  constructor(private paymentService: PaymentService) {
    this.calculateSummaryMetrics();
  }

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.filteredPayments = data;
        this.calculateSummaryMetrics();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
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
      // Convert the date string to the format expected by the backend
      const paymentToAdd = {
        ...this.newPayment,
        paymentDate: new Date(this.newPayment.paymentDate).toISOString()
      };
      
      this.paymentService.addPayment(paymentToAdd).subscribe({
        next: (response) => {
          // Reload the payments list
          this.loadPayments();
          // Reset the form
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding payment:', error);
        }
      });
    }
  }

  private validatePayment(): boolean {
    return !!(
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

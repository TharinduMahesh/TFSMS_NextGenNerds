

import { Component, OnInit } from '@angular/core';
import { Payment } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [PaymentService],
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

  newPayment: Payment = { 
    PaymentId: 0, 
    SupplierId: 0, 
    Amount: 0, 
    PaymentMethod: '', 
    PaymentDate: new Date().toISOString().split('T')[0] 
  };

  error: string | null = null;
  loading: boolean = false;

  constructor(private paymentService: PaymentService,
              
  ) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.error = null;
    
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        console.log('Received payments:', data); // Debug log
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        
        if (Array.isArray(data)) {
          this.payments = data;
          this.filteredPayments = [...data]; // Create a new array copy
          console.log('Filtered payments after assignment:', this.filteredPayments);
          this.calculateSummaryMetrics();
        } else {
          console.error('Data is not an array:', data);
          this.payments = [];
          this.filteredPayments = [];
        }
        
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
      .filter(p => p.PaymentMethod === 'Bank Transfer')
      .reduce((sum, p) => sum + Number(p.Amount), 0);
    this.totalCash = this.payments
      .filter(p => p.PaymentMethod === 'Cash')
      .reduce((sum, p) => sum + Number(p.Amount), 0);
    this.totalCheques = this.payments
      .filter(p => p.PaymentMethod === 'Cheques') 
      .reduce((sum, p) => sum + Number(p.Amount), 0);
  }

  filterPayments() {
    this.filteredPayments = this.payments.filter(payment => {
      const methodMatch = this.selectedMethod === 'All' || payment.PaymentMethod === this.selectedMethod;
      const dateMatch = !this.selectedDate || payment.PaymentDate.toString().includes(this.selectedDate);
      return methodMatch && dateMatch;
    });
  }

  addPayment() {
    if (this.validatePayment()) {
      this.loading = true;
      this.error = null;

      // Format the date to match the backend expected format
      const formattedPayment = {
        ...this.newPayment,
        paymentDate: new Date(this.newPayment.PaymentDate).toISOString()
      };

      this.paymentService.addPayment(formattedPayment).subscribe({
        next: (response) => {
          console.log('Payment added successfully:', response);
          this.loadPayments(); // Reload all payments
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
    if (!this.newPayment.SupplierId || this.newPayment.SupplierId <= 0) {
      this.error = 'Please enter a valid Supplier ID';
      return false;
    }
    if (!this.newPayment.Amount || this.newPayment.Amount <= 0) {
      this.error = 'Please enter a valid amount';
      return false;
    }
    if (!this.newPayment.PaymentMethod) {
      this.error = 'Please select a payment method';
      return false;
    }
    if (!this.newPayment.PaymentDate) {
      this.error = 'Please select a payment date';
      return false;
    }
    return true;
  }

  private resetForm() {
    this.newPayment = {
      PaymentId: 0,
      SupplierId: 0,
      Amount: 0,
      PaymentMethod: '',
      PaymentDate: new Date().toISOString().split('T')[0]
    };
    this.error = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../shared/services/payment.service';
import { Payment } from '../../../models/payment.model';
import { PaymentHistory } from '../../../models/payment-history.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  completedPayments: Payment[] = [];
  paymentHistory: PaymentHistory[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      completed: this.paymentService.getCompletedPayments(),
      history: this.paymentService.getPaymentHistory()
    }).subscribe({
      next: (results) => {
        this.completedPayments = results.completed;
        this.paymentHistory = results.history;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load page data. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  confirmPayment(paymentId: number): void {
    if (!confirm('Are you sure you want to mark this payment as paid? This cannot be undone.')) {
      return;
    }

    const payment = this.completedPayments.find(p => p.PaymentId === paymentId);
    if (payment) {
      payment.isConfirming = true;
    }

    this.paymentService.confirmPaymentAsPaid(paymentId).subscribe({
      next: () => {
        this.successMessage = `Payment ID ${paymentId} has been successfully marked as paid.`;
        this.loadAllData();
        setTimeout(() => (this.successMessage = null), 5000);
      },
      error: (err) => {
        this.error = `Failed to confirm payment ID ${paymentId}.`;
        if (payment) {
          payment.isConfirming = false;
        }
        console.error(err);
      },
    });
  }
}
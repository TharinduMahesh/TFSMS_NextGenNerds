import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../shared/services/payment.service';
import { Payment } from '../../../models/payment.model';
import { PaymentHistory } from '../../../models/payment-history.model';
import { forkJoin } from 'rxjs'; // ✨ Import forkJoin

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  finalizedPayments: Payment[] = [];
  paymentHistory: PaymentHistory[] = [];

  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    // ✨ We will now use a single method to load all data
    this.loadAllData();
  }

  // ✨ This is our new, combined loading method
  loadAllData(): void {
    this.isLoading = true;
    this.error = null;

    // forkJoin runs multiple API calls in parallel and waits for all of them to complete
    forkJoin({
      finalized: this.paymentService.getFinalizedPayments(),
      history: this.paymentService.getPaymentHistory()
    }).subscribe({
      next: (results) => {
        // results will contain { finalized: Payment[], history: PaymentHistory[] }
        this.finalizedPayments = results.finalized;
        this.paymentHistory = results.history;
        this.isLoading = false; // Set to false only when BOTH calls are successful
      },
      error: (err) => {
        this.error = 'Failed to load page data. Please try again later.';
        this.isLoading = false; // Also set to false on error
        console.error(err);
      }
    });
  }

  confirmPayment(paymentId: number): void {
    if (!confirm('Are you sure you want to mark this payment as paid? This cannot be undone.')) {
      return;
    }

    const payment = this.finalizedPayments.find(p => p.PaymentId === paymentId);
    if (payment) {
      payment.isConfirming = true;
    }

    this.paymentService.confirmPaymentAsPaid(paymentId).subscribe({
      next: () => {
        this.successMessage = `Payment ID ${paymentId} has been successfully marked as paid.`;
        
        // ✨ After confirming, reload all data for the page
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../shared/services/payment.service';
import { Payment } from '../../../models/payment.model';
import { PaymentHistory } from '../../../models/payment-history.model';
import { forkJoin } from 'rxjs';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { ToastService } from '../../../shared/services/toast.service';

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

  constructor(private paymentService: PaymentService
, 
              private confirmationService: ConfirmationService, 
              private toastService: ToastService
  ) {}

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


async confirmPayment(paymentId: number): Promise<void> {
  const confirmation = await this.confirmationService.confirm(
    'Are you sure you want to mark this payment as paid? This action cannot be undone.'
  );

  if (confirmation) {
    const payment = this.completedPayments.find(p => p.PaymentId === paymentId);
    if (payment) {
      payment.isConfirming = true; // Keep this for individual row loading state
    }

    const loadingToastId = this.toastService.showLoading('Confirming...', `Updating status for Payment ID ${paymentId}.`);

    this.paymentService.confirmPaymentAsPaid(paymentId).subscribe({
      next: () => {
        this.toastService.remove(loadingToastId);
        
        this.toastService.showSuccess('Success!', `Payment ID ${paymentId} has been marked as paid.`);
        
        this.loadAllData();
      },
      error: (err) => {
        // On error:
        if (payment) {
          payment.isConfirming = false; // Reset the specific row's loading state
        }
        
        this.toastService.remove(loadingToastId);
        
        this.toastService.showError('Confirmation Failed', `Failed to confirm payment ID ${paymentId}.`);
        console.error(err);
      },
    });
  }
}
}
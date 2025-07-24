// src/app/pages/payment-history/payment-history.component.ts

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentService } from "../../../shared/services/payment.service";
import { PaymentHistory } from "../../../models/payment-history.model"; // This import is correct and needed

@Component({
  selector: "app-payment-history",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./payment-history.component.html",
  styleUrls: ["./payment-history.component.css"],
})
export class PaymentHistoryComponent implements OnInit {
  
  // [THE FIX] The variable should be typed as an array of PaymentHistory objects.
  paymentHistory: PaymentHistory[] = []; // Changed from Payment[] to PaymentHistory[]
  
  isLoading = false;
  error: string | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPaymentHistory();
  }

  /**
   * Loads the audit trail of all payment actions (Create, Update, Delete, Finalize).
   */
  loadPaymentHistory(): void {
    this.isLoading = true;
    this.error = null;

    // This service method correctly fetches the history log.
    this.paymentService.getPaymentHistory().subscribe({
      next: (data) => {
        // The data is now correctly assigned to the PaymentHistory[] array.
        this.paymentHistory = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading payment history:", err);
        this.error = "Failed to load payment history. Please try again later.";
        this.isLoading = false;
      },
    });
  }

  // NOTE: The 'loadCompletedPayments' method from your original file represented a
  // different way of showing history (by listing completed payments). The method above,
  // 'loadPaymentHistory', shows the actual audit trail of events, which is more
  // aligned with the component's name. This version is cleaner and focuses on that one job.
}
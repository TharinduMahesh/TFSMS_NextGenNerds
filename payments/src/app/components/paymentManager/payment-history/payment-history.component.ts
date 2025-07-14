import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { PaymentService } from "../../../shared/services/payment.service"
import { PaymentHistory } from "../../../models/payment-history.model"

@Component({
  selector: "app-payment-history",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./payment-history.component.html",
  styleUrls: ["./payment-history.component.css"],
})
export class PaymentHistoryComponent implements OnInit {
  paymentHistory: PaymentHistory[] = []
  loading = false
  error: string | null = null

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPaymentHistory()
  }

  loadPaymentHistory(): void {
    this.loading = true
    this.error = null
    this.paymentService.getPaymentHistory().subscribe({
      next: (data) => {
        this.paymentHistory = data
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading payment history:", err)
        this.error = "Failed to load payment history. Please try again later."
        this.loading = false
      },
    })
  }
}

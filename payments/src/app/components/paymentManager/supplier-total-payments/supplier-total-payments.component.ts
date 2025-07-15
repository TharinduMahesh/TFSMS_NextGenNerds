import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { PaymentService } from "../../../shared/services/payment.service"
import  { SupplierTotalPayment } from "../../../models/supplier-total-payment.model"

@Component({
  selector: "app-supplier-total-payments",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./supplier-total-payments.component.html",
  styleUrls: ["./supplier-total-payments.component.css"],
})
export class SupplierTotalPaymentsComponent implements OnInit {
  supplierTotals: SupplierTotalPayment[] = []
  loading = false
  error: string | null = null

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadSupplierTotalPayments()
  }

  loadSupplierTotalPayments(): void {
    this.loading = true
    this.error = null
    this.paymentService.getSupplierTotalPayments().subscribe({
      next: (data) => {
        this.supplierTotals = data
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading supplier total payments:", err)
        this.error = "Failed to load supplier total payments. Please try again later."
        this.loading = false
      },
    })
  }
}

import { Component,  OnInit,  AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder, FormGroup, Validators } from "@angular/forms"
import  { Payment } from "../../../models/payment.model"
import  { Supplier } from "../../../models/supplier.model"
import  { PaymentService } from "../../../shared/services/payment.service"
import  { SupplierService } from "../../../shared/services/supplier.service"
import  { GreenLeafService } from "../../../shared/services/green-leaf.service"
import  { PaymentCalculationResult } from "../../../models/payment-calculation.model"

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  payments: Payment[] = []
  filteredPayments: Payment[] = []
  suppliers: Supplier[] = []
  paymentForm: FormGroup

  totalPayments = 0
  totalAmount = 0
  paymentsByCash = 0
  paymentsByBank = 0
  paymentsByCheque = 0

  selectedSupplier = ""
  selectedDateRange = "all"
  customStartDate = ""
  customEndDate = ""

  showCalculator = false
  calculationResult: PaymentCalculationResult | null = null

  loading = false
  error: string | null = null

  constructor(
    private paymentService: PaymentService,
    private supplierService: SupplierService,
    private greenLeafService: GreenLeafService,
    private fb: FormBuilder,
  ) {
    this.paymentForm = this.fb.group({
      SupplierId: ["", Validators.required],
      leafWeight: ["", [Validators.required, Validators.min(0.01)]],
      rate: [200, [Validators.required, Validators.min(0.01)]],
      grossAmount: [{ value: 0, disabled: true }],
      advanceDeduction: [0],
      debtDeduction: [0],
      incentiveAddition: [0],
      netAmount: [{ value: 0, disabled: true }],
      paymentMethod: ["Cash", Validators.required],
      paymentDate: [new Date().toISOString().split("T")[0], Validators.required],
         })

    // Subscribe to supplier changes to load green leaf weight
    this.paymentForm.get("SupplierId")?.valueChanges.subscribe((supplierId) => {
      if (supplierId) {
        this.loadGreenLeafWeight(supplierId)
      } else {
        this.paymentForm.get("leafWeight")?.setValue("")
      }
    })

    // Update gross amount when leaf weight or rate changes
    this.paymentForm.get("leafWeight")?.valueChanges.subscribe(() => this.updateGrossAmount())
    this.paymentForm.get("rate")?.valueChanges.subscribe(() => this.updateGrossAmount())

    // Update net amount when deductions or additions change
    this.paymentForm.get("advanceDeduction")?.valueChanges.subscribe(() => this.updateNetAmount())
    this.paymentForm.get("debtDeduction")?.valueChanges.subscribe(() => this.updateNetAmount())
    this.paymentForm.get("incentiveAddition")?.valueChanges.subscribe(() => this.updateNetAmount())
  }

  ngOnInit(): void {
    this.loadPayments()
    this.loadSuppliers()
    this.loadSummaryMetrics()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log("Payments array:", this.payments)
      console.log("Filtered payments array:", this.filteredPayments)
      if (this.payments.length === 0) {
        console.warn("No payments data available. Check API response.")
      }
    }, 1000)
  }

  // Load green leaf weight for selected supplier
  loadGreenLeafWeight(supplierId: number): void {
    if (!supplierId) return

    this.greenLeafService.getLatestGreenLeafWeight(supplierId).subscribe({
      next: (weight) => {
        console.log(`Latest green leaf weight for supplier ${supplierId}:`, weight)
        this.paymentForm.get("leafWeight")?.setValue(weight)
      },
      error: (err) => {
        console.error(`Error loading green leaf weight for supplier ${supplierId}:`, err)
        this.error = "Failed to load green leaf weight for selected supplier"
      },
    })
  }

  updateGrossAmount(): void {
    const leafWeight = this.paymentForm.get("leafWeight")?.value || 0
    const rate = this.paymentForm.get("rate")?.value || 0
    const grossAmount = leafWeight * rate
    this.paymentForm.get("grossAmount")?.setValue(grossAmount)
    this.updateNetAmount()
  }

  updateNetAmount(): void {
    const grossAmount = this.paymentForm.get("grossAmount")?.value || 0
    const advanceDeduction = this.paymentForm.get("advanceDeduction")?.value || 0
    const debtDeduction = this.paymentForm.get("debtDeduction")?.value || 0
    const incentiveAddition = this.paymentForm.get("incentiveAddition")?.value || 0

    const netAmount = grossAmount - advanceDeduction - debtDeduction + incentiveAddition
    this.paymentForm.get("netAmount")?.setValue(netAmount > 0 ? netAmount : 0)
  }

  private normalizePaymentData(payments: any[]): Payment[] {
    return payments.map((payment) => {
      // Handle both camelCase and PascalCase property names
      return {
        PaymentId: payment.PaymentId || payment.paymentId || 0,
        SupplierId: payment.SupplierId || payment.supplierId || 0,
        LeafWeight: payment.LeafWeight || payment.leafWeight || 0,
        Rate: payment.Rate || payment.rate || 0,
        GrossAmount: payment.GrossAmount || payment.grossAmount || 0,
        AdvanceDeduction: payment.AdvanceDeduction || payment.advanceDeduction || 0,
        DebtDeduction: payment.DebtDeduction || payment.debtDeduction || 0,
        IncentiveAddition: payment.IncentiveAddition || payment.incentiveAddition || 0,
        NetAmount: payment.NetAmount || payment.netAmount || 0,
        PaymentMethod: payment.PaymentMethod || payment.paymentMethod || "",
        PaymentDate: payment.PaymentDate || payment.paymentDate,
        CreatedBy: payment.CreatedBy || payment.createdBy || "System",
        CreatedDate: payment.CreatedDate || payment.createdDate || new Date(),
        Supplier: payment.Supplier || payment.supplier || null,
        Receipts: payment.Receipts || payment.receipts || [],
      }
    })
  }

  loadPayments(): void {
    this.loading = true
    this.error = null
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        console.log("Payments data received:", data)
        const paymentsArray = Array.isArray(data) ? data : []
        this.payments = this.normalizePaymentData(paymentsArray)
        console.log("Normalized payments:", this.payments)
        this.filteredPayments = [...this.payments]
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading payments:", err)
        this.error = "Failed to load payments. Please try again later."
        this.loading = false
        this.payments = []
        this.filteredPayments = []
      },
    })
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
        this.suppliers = Array.isArray(data) ? data : []
      },
      error: (err) => {
        console.error("Error loading suppliers:", err)
        this.suppliers = []
      },
    })
  }

  loadSummaryMetrics(): void {
    this.paymentService.getTotalPaymentsCount().subscribe({
      next: (total) => {
        this.totalPayments = total
      },
      error: (err) => {
        console.error("Error loading payments count:", err)
        this.totalPayments = 0
      },
    })

    this.paymentService.getTotalPaymentsAmount().subscribe({
      next: (total) => {
        this.totalAmount = total
      },
      error: (err) => {
        console.error("Error loading total payments amount:", err)
        this.totalAmount = 0
      },
    })

    this.paymentService.getTotalPaymentsByMethod("Cash").subscribe({
      next: (total) => {
        this.paymentsByCash = total
      },
      error: (err) => {
        console.error("Error loading cash payments:", err)
        this.paymentsByCash = 0
      },
    })

    this.paymentService.getTotalPaymentsByMethod("Bank Transfer").subscribe({
      next: (total) => {
        this.paymentsByBank = total
      },
      error: (err) => {
        console.error("Error loading bank transfer payments:", err)
        this.paymentsByBank = 0
      },
    })

    this.paymentService.getTotalPaymentsByMethod("Cheque").subscribe({
      next: (total) => {
        this.paymentsByCheque = total
      },
      error: (err) => {
        console.error("Error loading cheque payments:", err)
        this.paymentsByCheque = 0
      },
    })
  }

  toggleCalculator(): void {
    this.showCalculator = !this.showCalculator
  }

  onCalculationComplete(result: PaymentCalculationResult): void {
    this.calculationResult = result
    this.paymentForm.patchValue({
      SupplierId: result.supplierId,
      leafWeight: result.leafWeight,
      rate: result.rate,
      grossAmount: result.grossAmount,
      advanceDeduction: result.advanceDeduction,
      debtDeduction: result.debtDeduction,
      incentiveAddition: result.incentiveAddition,
      netAmount: result.netAmount,
    })
    this.showCalculator = false
  }

  createPayment(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm)
      return
    }

    this.loading = true
    this.error = null

    const formValues = this.paymentForm.getRawValue()
    const payment: Payment = {
      PaymentId: 0,
      SupplierId: formValues.SupplierId,
      LeafWeight: formValues.leafWeight,
      Rate: formValues.rate,
      GrossAmount: formValues.grossAmount,
      AdvanceDeduction: formValues.advanceDeduction,
      DebtDeduction: formValues.debtDeduction,
      IncentiveAddition: formValues.incentiveAddition,
      NetAmount: formValues.netAmount,
      PaymentMethod: formValues.paymentMethod,
      PaymentDate: new Date(formValues.paymentDate),
    }

    this.paymentService.createPayment(payment).subscribe({
      next: (result) => {
        this.loadPayments()
        this.loadSummaryMetrics()
        this.resetForm()
        this.error = null
        this.loading = false
      },
      error: (err) => {
        console.error("Error creating payment:", err)
        this.error = "Failed to create payment. Please try again."
        this.loading = false
      },
    })
  }

  exportPayments(format: string): void {
    let startDate = ""
    let endDate = ""
    if (this.selectedDateRange === "custom") {
      startDate = this.customStartDate
      endDate = this.customEndDate
    }

    this.paymentService.exportPayments(format, startDate, endDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `payments-export.${format.toLowerCase()}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      },
      error: (err) => {
        console.error("Error exporting payments:", err)
        this.error = "Failed to export payments. Please try again."
      },
    })
  }

  private resetForm(): void {
    this.paymentForm.reset({
      SupplierId: "",
      leafWeight: "",
      rate: 200,
      grossAmount: 0,
      advanceDeduction: 0,
      debtDeduction: 0,
      incentiveAddition: 0,
      netAmount: 0,
      paymentMethod: "Cash",
      paymentDate: new Date().toISOString().split("T")[0],
      notes: "",
    })
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      }
    })
  }
}

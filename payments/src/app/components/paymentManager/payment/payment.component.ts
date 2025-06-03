import { Component, OnInit,  AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder, FormGroup, Validators } from "@angular/forms"
import  { Payment } from "../../../models/payment.model"
import  { Supplier } from "../../../models/supplier.model"
import  { PaymentService } from "../../../shared/services/payment.service"
import  { SupplierService } from "../../../shared/services/supplier.service"
import { PaymentCalculatorComponent } from "../payment-calculater/payment-calculater.component"
import  { PaymentCalculationResult } from "../../../models/payment-calculation.model"

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaymentCalculatorComponent],
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
      notes: [""],
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

  // Add this method to check and fix property names in the received data
  private normalizePaymentData(payments: any[]): Payment[] {
    return payments.map((payment) => {
      // Check if the data is using camelCase instead of PascalCase
      if (payment.paymentId !== undefined && payment.PaymentId === undefined) {
        // Convert camelCase to PascalCase
        return {
          PaymentId: payment.paymentId,
          SupplierId: payment.supplierId || payment.SupplierId,
          LeafWeight: payment.leafWeight || payment.LeafWeight,
          Rate: payment.rate || payment.Rate,
          GrossAmount: payment.grossAmount || payment.GrossAmount,
          AdvanceDeduction: payment.advanceDeduction || payment.AdvanceDeduction || 0,
          DebtDeduction: payment.debtDeduction || payment.DebtDeduction || 0,
          IncentiveAddition: payment.incentiveAddition || payment.IncentiveAddition || 0,
          NetAmount: payment.netAmount || payment.NetAmount,
          PaymentMethod: payment.paymentMethod || payment.PaymentMethod,
          PaymentDate: payment.paymentDate || payment.PaymentDate,
          CreatedBy: payment.createdBy || payment.CreatedBy || "System",
          CreatedDate: payment.createdDate || payment.CreatedDate || new Date(),
          Supplier: payment.supplier || payment.Supplier || null,
          Receipts: payment.receipts || payment.Receipts || [],
        }
      }
      return payment
    })
  }

  // Modify the loadPayments method to use the normalizePaymentData function
  loadPayments(): void {
    this.loading = true
    this.error = null

    this.paymentService.getPayments().subscribe({
      next: (data) => {
        console.log("Payments data received:", data)

        // Ensure data is an array
        const paymentsArray = Array.isArray(data) ? data : []

        // Normalize the data to ensure consistent property names
        this.payments = this.normalizePaymentData(paymentsArray)

        console.log("Normalized payments:", this.payments)

        this.filteredPayments = [...this.payments]
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading payments:", err)
        this.error = "Failed to load payments. Please try again later."
        this.loading = false
        // Initialize with empty arrays to prevent errors
        this.payments = []
        this.filteredPayments = []
      },
    })
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
        // Ensure data is an array
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

  filterPayments(): void {
    let filtered = [...this.payments]

    // Filter by supplier
    if (this.selectedSupplier) {
      filtered = filtered.filter((payment) => payment.SupplierId.toString() === this.selectedSupplier)
    }

    // Filter by date range
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    if (this.selectedDateRange === "today") {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.PaymentDate)
        return paymentDate >= startOfToday
      })
    } else if (this.selectedDateRange === "week") {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())

      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.PaymentDate)
        return paymentDate >= startOfWeek
      })
    } else if (this.selectedDateRange === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.PaymentDate)
        return paymentDate >= startOfMonth
      })
    } else if (this.selectedDateRange === "custom" && this.customStartDate && this.customEndDate) {
      const startDate = new Date(this.customStartDate)
      const endDate = new Date(this.customEndDate)
      endDate.setHours(23, 59, 59) // Include the entire end date

      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.PaymentDate)
        return paymentDate >= startDate && paymentDate <= endDate
      })
    }

    this.filteredPayments = filtered
  }

  toggleCalculator(): void {
    this.showCalculator = !this.showCalculator
  }

  onCalculationComplete(result: PaymentCalculationResult): void {
    this.calculationResult = result

    // Update form with calculation results
    this.paymentForm.patchValue({
      grossAmount: result.grossAmount,
      advanceDeduction: result.advanceDeduction,
      debtDeduction: result.debtDeduction,
      incentiveAddition: result.incentiveAddition,
      netAmount: result.netAmount,
    })

    // Hide calculator after using values
    this.showCalculator = false
  }

  createPayment(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm)
      return
    }

    this.loading = true
    this.error = null

    // Get form values
    const formValues = this.paymentForm.getRawValue() // Get disabled fields too

    // Create payment object
    const payment: Payment = {
      PaymentId: 0, // New payment
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
      // PaymentHistories: []
    }

    this.paymentService.createPayment(payment).subscribe({
      next: (result) => {
        // Refresh data
        this.loadPayments()
        this.loadSummaryMetrics()

        // Reset form
        this.resetForm()

        // Show success message
        this.error = null
        this.loading = false

        // Generate receipt
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log("Payments array:", this.payments)
      console.log("Filtered payments array:", this.filteredPayments)
      if (this.payments.length === 0) {
        console.warn("No payments data available. Check API response.")
      }
    }, 1000)
  }
}
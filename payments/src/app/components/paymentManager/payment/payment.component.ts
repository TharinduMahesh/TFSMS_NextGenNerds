// import { Component,  OnInit,  AfterViewInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule, ReactiveFormsModule,  FormBuilder, FormGroup, Validators } from "@angular/forms"
// import  { Payment } from "../../../models/payment.model"
// import  { Supplier } from "../../../models/supplier.model"
// import  { PaymentService } from "../../../shared/services/payment.service"
// import  { SupplierService } from "../../../shared/services/supplier.service"
// import  { GreenLeafService } from "../../../shared/services/green-leaf.service"
// import  { ExportService } from "../../../shared/services/export.service"
// import  { PaymentCalculationResult } from "../../../models/payment-calculation.model"
// import  { IncentiveService } from "../../../shared/services/incentive.service"

// @Component({
//   selector: "app-payment",
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: "./payment.component.html",
//   styleUrls: ["./payment.component.css"],
// })
// export class PaymentComponent implements OnInit, AfterViewInit {
//   payments: Payment[] = []
//   filteredPayments: Payment[] = []
//   suppliers: Supplier[] = []
//   paymentForm: FormGroup

//   // Summary metrics
//   totalPayments = 0
//   totalAmount = 0
//   paymentsByCash = 0
//   paymentsByBank = 0

//   // Filter and search properties
//   selectedSupplier = ""
//   selectedPaymentMethod = ""
//   selectedDateRange = "all"
//   customStartDate = ""
//   customEndDate = ""
//   searchTerm = ""

//   // UI state
//   showCalculator = false
//   calculationResult: PaymentCalculationResult | null = null
//   currentIncentiveQualityBonus = 0
//   currentIncentiveLoyaltyBonus = 0
//   currentIncentiveTotalAmount = 0
//   currentIncentiveUsedAmount = 0
//   currentIncentiveBalanceAmount = 0
//   loading = false
//   error: string | null = null

//   constructor(
//     private paymentService: PaymentService,
//     private supplierService: SupplierService,
//     private greenLeafService: GreenLeafService,
//     private exportService: ExportService,
//     private incentiveService: IncentiveService,
//     private fb: FormBuilder,
//   ) {
//     this.paymentForm = this.fb.group({
//       SupplierId: ["", Validators.required],
//       leafWeight: ["", [Validators.required, Validators.min(0.01)]],
//       rate: [200, [Validators.required, Validators.min(0.01)]],
//       grossAmount: [{ value: 0, disabled: true }],
//       incentiveAddition: [0],
//       netAmount: [{ value: 0, disabled: true }],
//       paymentMethod: ["Cash", Validators.required],
//       paymentDate: [new Date().toISOString().split("T")[0], Validators.required],
//     })

//     // Subscribe to supplier changes to load BOTH green leaf weight AND incentive data
//     this.paymentForm.get("SupplierId")?.valueChanges.subscribe((supplierId) => {
//       if (supplierId) {
//         console.log("Supplier selected:", supplierId)
//         this.loadGreenLeafWeight(supplierId)
//         this.loadCurrentIncentiveAmount(supplierId)
//       } else {
//         this.paymentForm.get("leafWeight")?.setValue("")
//         this.paymentForm.get("incentiveAddition")?.setValue(0)
//         // Clear incentive display fields when no supplier is selected
//         this.currentIncentiveQualityBonus = 0
//         this.currentIncentiveLoyaltyBonus = 0
//         this.currentIncentiveTotalAmount = 0
//         this.currentIncentiveUsedAmount = 0
//         this.currentIncentiveBalanceAmount = 0
//       }
//     })

//     // Update gross amount when leaf weight or rate changes
//     this.paymentForm.get("leafWeight")?.valueChanges.subscribe(() => this.updateGrossAmount())
//     this.paymentForm.get("rate")?.valueChanges.subscribe(() => this.updateGrossAmount())

//     // Update net amount when deductions or additions change
//     this.paymentForm.get("incentiveAddition")?.valueChanges.subscribe(() => this.updateNetAmount())
//   }

//   ngOnInit(): void {
//     this.loadPayments()
//     this.loadSuppliers()
//     this.loadSummaryMetrics()
//   }

//   ngAfterViewInit(): void {
//     setTimeout(() => {
//       console.log("Payments array:", this.payments)
//       console.log("Filtered payments array:", this.filteredPayments)
//       if (this.payments.length === 0) {
//         console.warn("No payments data available. Check API response.")
//       }
//     }, 1000)
//   }

//   // Search and filter functionality
//   applyFilters(): void {
//     if (!Array.isArray(this.payments)) {
//       this.filteredPayments = []
//       return
//     }

//     this.filteredPayments = this.payments.filter((payment) => {
//       // Search term filter
//       const searchMatch =
//         !this.searchTerm ||
//         payment.PaymentId.toString().includes(this.searchTerm) ||
//         payment.SupplierId.toString().includes(this.searchTerm) ||
//         payment.PaymentMethod.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         payment.NetAmount.toString().includes(this.searchTerm)

//       // Supplier filter
//       const supplierMatch = !this.selectedSupplier || payment.SupplierId.toString() === this.selectedSupplier

//       // Payment method filter
//       const methodMatch = !this.selectedPaymentMethod || payment.PaymentMethod === this.selectedPaymentMethod

//       // Date range filter
//       let dateMatch = true
//       if (this.selectedDateRange === "custom" && this.customStartDate && this.customEndDate) {
//         const paymentDate = new Date(payment.PaymentDate)
//         const startDate = new Date(this.customStartDate)
//         const endDate = new Date(this.customEndDate)
//         dateMatch = paymentDate >= startDate && paymentDate <= endDate
//       } else if (this.selectedDateRange === "today") {
//         const today = new Date()
//         const paymentDate = new Date(payment.PaymentDate)
//         dateMatch = paymentDate.toDateString() === today.toDateString()
//       } else if (this.selectedDateRange === "week") {
//         const weekAgo = new Date()
//         weekAgo.setDate(weekAgo.getDate() - 7)
//         const paymentDate = new Date(payment.PaymentDate)
//         dateMatch = paymentDate >= weekAgo
//       } else if (this.selectedDateRange === "month") {
//         const monthAgo = new Date()
//         monthAgo.setMonth(monthAgo.getMonth() - 1)
//         const paymentDate = new Date(payment.PaymentDate)
//         dateMatch = paymentDate >= monthAgo
//       }

//       return searchMatch && supplierMatch && methodMatch && dateMatch
//     })
//   }

//   onSearchChange(): void {
//     this.applyFilters()
//   }

//   onFilterChange(): void {
//     this.applyFilters()
//   }

//   clearFilters(): void {
//     this.searchTerm = ""
//     this.selectedSupplier = ""
//     this.selectedPaymentMethod = ""
//     this.selectedDateRange = "all"
//     this.customStartDate = ""
//     this.customEndDate = ""
//     this.applyFilters()
//   }

//   // Delete functionality
//   deletePayment(paymentId: number): void {
//     if (confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
//       this.loading = true
//       this.error = null

//       this.paymentService.deletePayment(paymentId).subscribe({
//         next: (success) => {
//           if (success) {
//             // Reload data after successful deletion
//             this.loadPayments()
//             this.loadSummaryMetrics()
//             console.log("Payment deleted successfully")
//           } else {
//             this.error = "Failed to delete payment. Please try again."
//           }
//           this.loading = false
//         },
//         error: (err) => {
//           console.error("Error deleting payment:", err)
//           this.error = "Failed to delete payment. Please try again."
//           this.loading = false
//         },
//       })
//     }
//   }

//   // Export functionality
//   exportPaymentsData(format: string): void {
//     this.loading = true
//     this.exportService.exportPayments(format).subscribe({
//       next: (blob) => {
//         const filename = `payments-export.${format.toLowerCase()}`
//         this.exportService.downloadFile(blob, filename)
//         this.loading = false
//       },
//       error: (err) => {
//         console.error("Error exporting payments:", err)
//         this.error = "Failed to export payments. Please try again."
//         this.loading = false
//       },
//     })
//   }

//   // Load green leaf weight for selected supplier
//   loadGreenLeafWeight(supplierId: number): void {
//     if (!supplierId) return
//     console.log("Loading green leaf weight for supplier:", supplierId)
//     this.greenLeafService.getLatestGreenLeafWeight(supplierId).subscribe({
//       next: (weight) => {
//         console.log(`Latest green leaf weight for supplier ${supplierId}:`, weight)
//         this.paymentForm.get("leafWeight")?.setValue(weight)
//       },
//       error: (err) => {
//         console.error(`Error loading green leaf weight for supplier ${supplierId}:`, err)
//         this.error = "Failed to load green leaf weight for selected supplier"
//       },
//     })
//   }

//   // Load current incentive amount for selected supplier
//   loadCurrentIncentiveAmount(supplierId: number): void {
//     if (!supplierId) {
//       this.currentIncentiveQualityBonus = 0
//       this.currentIncentiveLoyaltyBonus = 0
//       this.currentIncentiveTotalAmount = 0
//       this.currentIncentiveUsedAmount = 0
//       this.currentIncentiveBalanceAmount = 0
//       this.paymentForm.get("incentiveAddition")?.setValue(0)
//       return
//     }
//     console.log("Loading current incentive details for supplier:", supplierId)

//     this.incentiveService.getLatestIncentive(supplierId).subscribe({
//       next: (incentiveData) => {
//         console.log(`Latest incentive for supplier ${supplierId}:`, incentiveData)
//         this.currentIncentiveQualityBonus = incentiveData.QualityBonus || 0
//         this.currentIncentiveLoyaltyBonus = incentiveData.LoyaltyBonus || 0
//         this.currentIncentiveTotalAmount = incentiveData.TotalAmount || 0
//         this.currentIncentiveUsedAmount = incentiveData.UsedAmount || 0
//         this.currentIncentiveBalanceAmount = incentiveData.BalanceAmount || 0
//         this.paymentForm.get("incentiveAddition")?.setValue(this.currentIncentiveBalanceAmount)
//         this.updateNetAmount()
//       },
//       error: (err) => {
//         console.error(`Error loading incentive details for supplier ${supplierId}:`, err)
//         // Reset incentive display fields and form control if an error occurs
//         this.currentIncentiveQualityBonus = 0
//         this.currentIncentiveLoyaltyBonus = 0
//         this.currentIncentiveTotalAmount = 0
//         this.currentIncentiveUsedAmount = 0
//         this.currentIncentiveBalanceAmount = 0
//         this.paymentForm.get("incentiveAddition")?.setValue(0)
//       },
//     })
//   }

//   updateGrossAmount(): void {
//     const leafWeight = this.paymentForm.get("leafWeight")?.value || 0
//     const rate = this.paymentForm.get("rate")?.value || 0
//     const grossAmount = leafWeight * rate
//     this.paymentForm.get("grossAmount")?.setValue(grossAmount)
//     this.updateNetAmount()
//   }

//   updateNetAmount(): void {
//     const grossAmount = this.paymentForm.get("grossAmount")?.value || 0
//     const advanceDeduction = this.paymentForm.get("advanceDeduction")?.value || 0
//     const debtDeduction = this.paymentForm.get("debtDeduction")?.value || 0
//     const incentiveAddition = this.paymentForm.get("incentiveAddition")?.value || 0
//     const netAmount = grossAmount - advanceDeduction - debtDeduction + incentiveAddition
//     this.paymentForm.get("netAmount")?.setValue(netAmount > 0 ? netAmount : 0)
//   }

//   private normalizePaymentData(payments: any[]): Payment[] {
//     return payments.map((payment) => {
//       return {
//         PaymentId: payment.PaymentId || payment.paymentId || 0,
//         SupplierId: payment.SupplierId || payment.supplierId || 0,
//         LeafWeight: payment.LeafWeight || payment.leafWeight || 0,
//         Rate: payment.Rate || payment.rate || 0,
//         GrossAmount: payment.GrossAmount || payment.grossAmount || 0,
//         AdvanceDeduction: payment.AdvanceDeduction || payment.advanceDeduction || 0,
//         DebtDeduction: payment.DebtDeduction || payment.debtDeduction || 0,
//         IncentiveAddition: payment.IncentiveAddition || payment.incentiveAddition || 0,
//         NetAmount: payment.NetAmount || payment.netAmount || 0,
//         PaymentMethod: payment.PaymentMethod || payment.paymentMethod || "",
//         PaymentDate: payment.PaymentDate || payment.paymentDate,
//         CreatedBy: payment.CreatedBy || payment.createdBy || "System",
//         CreatedDate: payment.CreatedDate || payment.createdDate || new Date(),
//         Supplier: payment.Supplier || payment.supplier || null,
//         Receipts: payment.Receipts || payment.receipts || [],
//       }
//     })
//   }

//   loadPayments(): void {
//     this.loading = true
//     this.error = null
//     this.paymentService.getPayments().subscribe({
//       next: (data) => {
//         console.log("Payments data received:", data)
//         const paymentsArray = Array.isArray(data) ? data : []
//         this.payments = this.normalizePaymentData(paymentsArray)
//         console.log("Normalized payments:", this.payments)
//         this.applyFilters()
//         this.loading = false
//       },
//       error: (err) => {
//         console.error("Error loading payments:", err)
//         this.error = "Failed to load payments. Please try again later."
//         this.loading = false
//         this.payments = []
//         this.filteredPayments = []
//       },
//     })
//   }

//   loadSuppliers(): void {
//     this.supplierService.getActiveSuppliers().subscribe({
//       next: (data) => {
//         this.suppliers = Array.isArray(data) ? data : []
//       },
//       error: (err) => {
//         console.error("Error loading suppliers:", err)
//         this.suppliers = []
//       },
//     })
//   }

//   loadSummaryMetrics(): void {
//     this.paymentService.getTotalPaymentsCount().subscribe({
//       next: (total) => {
//         this.totalPayments = total
//       },
//       error: (err) => {
//         console.error("Error loading payments count:", err)
//         this.totalPayments = 0
//       },
//     })

//     this.paymentService.getTotalPaymentsAmount().subscribe({
//       next: (total) => {
//         this.totalAmount = total
//       },
//       error: (err) => {
//         console.error("Error loading total payments amount:", err)
//         this.totalAmount = 0
//       },
//     })

//     this.paymentService.getTotalPaymentsByMethod("Cash").subscribe({
//       next: (total) => {
//         this.paymentsByCash = total
//       },
//       error: (err) => {
//         console.error("Error loading cash payments:", err)
//         this.paymentsByCash = 0
//       },
//     })

//     this.paymentService.getTotalPaymentsByMethod("Bank Transfer").subscribe({
//       next: (total) => {
//         this.paymentsByBank = total
//       },
//       error: (err) => {
//         console.error("Error loading bank transfer payments:", err)
//         this.paymentsByBank = 0
//       },
//     })

//     this.paymentService.getTotalPaymentsByMethod("Cheque").subscribe({
//       next: (total) => {
//         this.paymentsByCheque = total
//       },
//       error: (err) => {
//         console.error("Error loading cheque payments:", err)
//         this.paymentsByCheque = 0
//       },
//     })
//   }

//   toggleCalculator(): void {
//     this.showCalculator = !this.showCalculator
//   }

//   onCalculationComplete(result: PaymentCalculationResult): void {
//     this.calculationResult = result
//     this.paymentForm.patchValue({
//       SupplierId: result.supplierId,
//       leafWeight: result.leafWeight,
//       rate: result.rate,
//       grossAmount: result.grossAmount,
//       incentiveAddition: result.incentiveAddition,
//       netAmount: result.netAmount,
//     })
//     this.showCalculator = false
//   }

//   createPayment(): void {
//     if (this.paymentForm.invalid) {
//       this.markFormGroupTouched(this.paymentForm)
//       return
//     }

//     this.loading = true
//     this.error = null
//     const formValues = this.paymentForm.getRawValue()

//     const payment: Payment = {
//       PaymentId: 0,
//       SupplierId: formValues.SupplierId,
//       LeafWeight: formValues.leafWeight,
//       Rate: formValues.rate,
//       GrossAmount: formValues.grossAmount,
//       IncentiveAddition: formValues.incentiveAddition,
//       NetAmount: formValues.netAmount,
//       PaymentMethod: formValues.paymentMethod,
//       PaymentDate: new Date(formValues.paymentDate),
//     }

//     console.log("Creating payment with data:", payment)

//     this.paymentService.createPayment(payment).subscribe({
//       next: (result) => {
//         console.log("Payment created successfully:", result)

//         // Update incentive usage if incentive was used
//         if (formValues.incentiveAddition > 0) {
//           console.log("Updating incentive usage...")
//           this.incentiveService.updateIncentiveUsage(formValues.SupplierId, formValues.incentiveAddition).subscribe({
//             next: (success) => {
//               console.log("Incentive usage updated:", success)
//             },
//             error: (err) => {
//               console.error("Error updating incentive usage:", err)
//             },
//           })
//         }

//         this.loadPayments()
//         this.loadSummaryMetrics()
//         this.resetForm()
//         this.error = null
//         this.loading = false
//       },
//       error: (err) => {
//         console.error("Error creating payment:", err)
//         this.error = "Failed to create payment. Please try again."
//         this.loading = false
//       },
//     })
//   }

//   private resetForm(): void {
//     this.paymentForm.reset({
//       SupplierId: "",
//       leafWeight: "",
//       rate: 200,
//       grossAmount: 0,
//       incentiveAddition: 0,
//       netAmount: 0,
//       paymentMethod: "Cash",
//       paymentDate: new Date().toISOString().split("T")[0],
//     })
//   }

//   private markFormGroupTouched(formGroup: FormGroup): void {
//     Object.values(formGroup.controls).forEach((control) => {
//       control.markAsTouched()
//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control)
//       }
//     })
//   }
// }

import { Component,  OnInit,  AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder, FormGroup, Validators } from "@angular/forms"
import  { Payment } from "../../../models/payment.model"
import  { Supplier } from "../../../models/supplier.model"
import  { PaymentService } from "../../../shared/services/payment.service"
import  { SupplierService } from "../../../shared/services/supplier.service"
import  { GreenLeafService } from "../../../shared/services/green-leaf.service"
import  { ExportService } from "../../../shared/services/export.service"
import  { PaymentCalculationResult } from "../../../models/payment-calculation.model"
import  { IncentiveService } from "../../../shared/services/incentive.service"

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [PaymentService, SupplierService, GreenLeafService, ExportService, IncentiveService],
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  payments: Payment[] = []
  filteredPayments: Payment[] = []
  suppliers: Supplier[] = []
  paymentForm: FormGroup

  // Summary metrics
  totalPayments = 0
  totalAmount = 0
  paymentsByCash = 0
  paymentsByBank = 0

  // Filter and search properties
  selectedSupplier = ""
  selectedPaymentMethod = ""
  selectedDateRange = "all"
  customStartDate = ""
  customEndDate = ""
  searchTerm = ""

  // UI state
  showCalculator = false
  calculationResult: PaymentCalculationResult | null = null
  currentIncentiveQualityBonus = 0
  currentIncentiveLoyaltyBonus = 0
  currentIncentiveTotalAmount = 0
  currentIncentiveUsedAmount = 0
  currentIncentiveBalanceAmount = 0
  currentSupplierBankAccount = ""
  loading = false
  error: string | null = null

  // Edit functionality
  isEditing = false
  editingPaymentId: number | null = null

  constructor(
    private paymentService: PaymentService,
    private supplierService: SupplierService,
    private greenLeafService: GreenLeafService,
    private exportService: ExportService,
    private incentiveService: IncentiveService,
    private fb: FormBuilder,
  ) {
    this.paymentForm = this.fb.group({
      SupplierId: ["", Validators.required],
      NormalTeaLeafWeight: ["", [Validators.required, Validators.min(0.01)]],
      GoldenTipTeaLeafWeight: ["", [Validators.required, Validators.min(0)]],
      Rate: [200, [Validators.required, Validators.min(0.01)]],
      GrossAmount: [{ value: 0, disabled: true }],
      IncentiveAddition: [0],
      NetAmount: [{ value: 0, disabled: true }],
      PaymentMethod: ["Cash", Validators.required],
      PaymentDate: [new Date().toISOString().split("T")[0], Validators.required],
      BankAccount: [{ value: "", disabled: true }],
    })

    // Subscribe to supplier changes to load green leaf weights, incentive data, and bank account
    this.paymentForm.get("SupplierId")?.valueChanges.subscribe((supplierId) => {
      if (supplierId) {
        console.log("Supplier selected:", supplierId)
        this.loadGreenLeafWeights(supplierId)
        this.loadCurrentIncentiveAmount(supplierId)
        this.loadSupplierBankAccount(supplierId)
      } else {
        this.resetSupplierData()
      }
    })

    // Update gross amount when weights or rate changes
    this.paymentForm.get("NormalTeaLeafWeight")?.valueChanges.subscribe(() => this.updateGrossAmount())
    this.paymentForm.get("GoldenTipTeaLeafWeight")?.valueChanges.subscribe(() => this.updateGrossAmount())
    this.paymentForm.get("Rate")?.valueChanges.subscribe(() => this.updateGrossAmount())

    // Update net amount when incentive changes
    this.paymentForm.get("IncentiveAddition")?.valueChanges.subscribe(() => this.updateNetAmount())
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

  // Load green leaf weights for selected supplier
  loadGreenLeafWeights(supplierId: number): void {
    if (!supplierId) return

    console.log("Loading green leaf weights for supplier:", supplierId)
    this.greenLeafService.getLatestGreenLeafWeights(supplierId).subscribe({
      next: (weights) => {
        console.log(`Latest green leaf weights for supplier ${supplierId}:`, weights)
        this.paymentForm.get("NormalTeaLeafWeight")?.setValue(weights.normalWeight)
        this.paymentForm.get("GoldenTipTeaLeafWeight")?.setValue(weights.goldenTipWeight)
      },
      error: (err) => {
        console.error(`Error loading green leaf weights for supplier ${supplierId}:`, err)
        this.error = "Failed to load green leaf weights for selected supplier"
      },
    })
  }

  // Load supplier bank account
  loadSupplierBankAccount(supplierId: number): void {
    const supplier = this.suppliers.find((s) => s.SupplierId === supplierId)
    if (supplier && supplier.BankAccount) {
      this.currentSupplierBankAccount = supplier.BankAccount
      this.paymentForm.get("BankAccount")?.setValue(supplier.BankAccount)
    } else {
      this.currentSupplierBankAccount = ""
      this.paymentForm.get("BankAccount")?.setValue("")
    }
  }

  // Load current incentive amount for selected supplier
  loadCurrentIncentiveAmount(supplierId: number): void {
    if (!supplierId) {
      this.resetIncentiveData()
      return
    }

    console.log("Loading current incentive details for supplier:", supplierId)
    this.incentiveService.getLatestIncentive(supplierId).subscribe({
      next: (incentiveData) => {
        console.log(`Latest incentive for supplier ${supplierId}:`, incentiveData)
        this.currentIncentiveQualityBonus = incentiveData.QualityBonus || 0
        this.currentIncentiveLoyaltyBonus = incentiveData.LoyaltyBonus || 0
        this.currentIncentiveTotalAmount = incentiveData.TotalAmount || 0
        this.currentIncentiveUsedAmount = incentiveData.UsedAmount || 0
        this.currentIncentiveBalanceAmount = incentiveData.BalanceAmount || 0
        this.paymentForm.get("IncentiveAddition")?.setValue(this.currentIncentiveBalanceAmount)
        this.updateNetAmount()
      },
      error: (err) => {
        console.error(`Error loading incentive details for supplier ${supplierId}:`, err)
        this.resetIncentiveData()
      },
    })
  }

  resetSupplierData(): void {
    this.paymentForm.get("NormalTeaLeafWeight")?.setValue("")
    this.paymentForm.get("GoldenTipTeaLeafWeight")?.setValue("")
    this.paymentForm.get("IncentiveAddition")?.setValue(0)
    this.paymentForm.get("BankAccount")?.setValue("")
    this.currentSupplierBankAccount = ""
    this.resetIncentiveData()
  }

  resetIncentiveData(): void {
    this.currentIncentiveQualityBonus = 0
    this.currentIncentiveLoyaltyBonus = 0
    this.currentIncentiveTotalAmount = 0
    this.currentIncentiveUsedAmount = 0
    this.currentIncentiveBalanceAmount = 0
    this.paymentForm.get("IncentiveAddition")?.setValue(0)
  }

  updateGrossAmount(): void {
    const normalWeight = this.paymentForm.get("NormalTeaLeafWeight")?.value || 0
    const goldenTipWeight = this.paymentForm.get("GoldenTipTeaLeafWeight")?.value || 0
    const rate = this.paymentForm.get("Rate")?.value || 0
    const totalWeight = normalWeight + goldenTipWeight
    const grossAmount = totalWeight * rate
    this.paymentForm.get("GrossAmount")?.setValue(grossAmount)
    this.updateNetAmount()
  }

  updateNetAmount(): void {
    const grossAmount = this.paymentForm.get("GrossAmount")?.value || 0
    const incentiveAddition = this.paymentForm.get("IncentiveAddition")?.value || 0
    const netAmount = grossAmount + incentiveAddition
    this.paymentForm.get("NetAmount")?.setValue(netAmount > 0 ? netAmount : 0)
  }

  // Edit functionality
  editPayment(payment: Payment): void {
    this.isEditing = true
    this.editingPaymentId = payment.PaymentId

    this.paymentForm.patchValue({
      SupplierId: payment.SupplierId,
      NormalTeaLeafWeight: payment.NormalTeaLeafWeight,
      GoldenTipTeaLeafWeight: payment.GoldenTipTeaLeafWeight,
      Rate: payment.Rate,
      GrossAmount: payment.GrossAmount,
      IncentiveAddition: payment.IncentiveAddition,
      NetAmount: payment.NetAmount,
      PaymentMethod: payment.PaymentMethod,
      PaymentDate: new Date(payment.PaymentDate).toISOString().split("T")[0],
      BankAccount: payment.Supplier?.BankAccount || "",
    })
  }

  cancelEdit(): void {
    this.isEditing = false
    this.editingPaymentId = null
    this.resetForm()
  }

  // Search and filter functionality
  applyFilters(): void {
    if (!Array.isArray(this.payments)) {
      this.filteredPayments = []
      return
    }

    this.filteredPayments = this.payments.filter((payment) => {
      // Search term filter
      const searchMatch =
        !this.searchTerm ||
        payment.PaymentId.toString().includes(this.searchTerm) ||
        payment.SupplierId.toString().includes(this.searchTerm) ||
        payment.PaymentMethod.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.NetAmount.toString().includes(this.searchTerm) ||
        payment.Supplier?.Name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.Supplier?.BankAccount?.includes(this.searchTerm)

      // Supplier filter
      const supplierMatch = !this.selectedSupplier || payment.SupplierId.toString() === this.selectedSupplier

      // Payment method filter
      const methodMatch = !this.selectedPaymentMethod || payment.PaymentMethod === this.selectedPaymentMethod

      // Date range filter
      let dateMatch = true
      if (this.selectedDateRange === "custom" && this.customStartDate && this.customEndDate) {
        const paymentDate = new Date(payment.PaymentDate)
        const startDate = new Date(this.customStartDate)
        const endDate = new Date(this.customEndDate)
        dateMatch = paymentDate >= startDate && paymentDate <= endDate
      } else if (this.selectedDateRange === "today") {
        const today = new Date()
        const paymentDate = new Date(payment.PaymentDate)
        dateMatch = paymentDate.toDateString() === today.toDateString()
      } else if (this.selectedDateRange === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const paymentDate = new Date(payment.PaymentDate)
        dateMatch = paymentDate >= weekAgo
      } else if (this.selectedDateRange === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        const paymentDate = new Date(payment.PaymentDate)
        dateMatch = paymentDate >= monthAgo
      }

      return searchMatch && supplierMatch && methodMatch && dateMatch
    })
  }

  onSearchChange(): void {
    this.applyFilters()
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  clearFilters(): void {
    this.searchTerm = ""
    this.selectedSupplier = ""
    this.selectedPaymentMethod = ""
    this.selectedDateRange = "all"
    this.customStartDate = ""
    this.customEndDate = ""
    this.applyFilters()
  }

  // Delete functionality
  deletePayment(paymentId: number): void {
    if (confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
      this.loading = true
      this.error = null
      this.paymentService.deletePayment(paymentId).subscribe({
        next: (success) => {
          if (success) {
            this.loadPayments()
            this.loadSummaryMetrics()
            console.log("Payment deleted successfully")
          } else {
            this.error = "Failed to delete payment. Please try again."
          }
          this.loading = false
        },
        error: (err) => {
          console.error("Error deleting payment:", err)
          this.error = "Failed to delete payment. Please try again."
          this.loading = false
        },
      })
    }
  }

  // Export functionality
  exportPaymentsData(format: string): void {
    this.loading = true
    this.exportService.exportPayments(format).subscribe({
      next: (blob) => {
        const filename = `payments-export.${format.toLowerCase()}`
        this.exportService.downloadFile(blob, filename)
        this.loading = false
      },
      error: (err) => {
        console.error("Error exporting payments:", err)
        this.error = "Failed to export payments. Please try again."
        this.loading = false
      },
    })
  }

  private normalizePaymentData(payments: any[]): Payment[] {
    return payments.map((payment) => {
      return {
        PaymentId: payment.PaymentId || payment.paymentId || 0,
        SupplierId: payment.SupplierId || payment.supplierId || 0,
        NormalTeaLeafWeight: payment.NormalTeaLeafWeight || payment.normalTeaLeafWeight || 0,
        GoldenTipTeaLeafWeight: payment.GoldenTipTeaLeafWeight || payment.goldenTipTeaLeafWeight || 0,
        Rate: payment.Rate || payment.rate || 0,
        GrossAmount: payment.GrossAmount || payment.grossAmount || 0,
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
        this.applyFilters()
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
  }

  toggleCalculator(): void {
    this.showCalculator = !this.showCalculator
  }

  onCalculationComplete(result: PaymentCalculationResult): void {
    this.calculationResult = result
    this.paymentForm.patchValue({
      SupplierId: result.supplierId,
      NormalTeaLeafWeight: result.NormalTeaLeafWeight,
      GoldenTipTeaLeafWeight: result.GoldenTipTeaLeafWeight,
      Rate: result.rate,
      GrossAmount: result.grossAmount,
      IncentiveAddition: result.incentiveAddition,
      NetAmount: result.netAmount,
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
      PaymentId: this.isEditing ? this.editingPaymentId! : 0,
      SupplierId: formValues.SupplierId,
      NormalTeaLeafWeight: formValues.NormalTeaLeafWeight,
      GoldenTipTeaLeafWeight: formValues.GoldenTipTeaLeafWeight,
      Rate: formValues.Rate,
      GrossAmount: formValues.GrossAmount,
      IncentiveAddition: formValues.IncentiveAddition,
      NetAmount: formValues.NetAmount,
      PaymentMethod: formValues.PaymentMethod,
      PaymentDate: new Date(formValues.PaymentDate),
    }

    console.log(`${this.isEditing ? "Updating" : "Creating"} payment with data:`, payment)

    const serviceCall = this.isEditing
      ? this.paymentService.updatePayment(payment)
      : this.paymentService.createPayment(payment)

    serviceCall.subscribe({
      next: (result) => {
        console.log(`Payment ${this.isEditing ? "updated" : "created"} successfully:`, result)

        // Update incentive usage if incentive was used
        if (formValues.IncentiveAddition > 0) {
          console.log("Updating incentive usage...")
          this.incentiveService.updateIncentiveUsage(formValues.SupplierId, formValues.IncentiveAddition).subscribe({
            next: (success) => {
              console.log("Incentive usage updated:", success)
            },
            error: (err) => {
              console.error("Error updating incentive usage:", err)
            },
          })
        }

        this.loadPayments()
        this.loadSummaryMetrics()
        this.resetForm()
        this.error = null
        this.loading = false
      },
      error: (err) => {
        console.error(`Error ${this.isEditing ? "updating" : "creating"} payment:`, err)
        this.error = `Failed to ${this.isEditing ? "update" : "create"} payment. Please try again.`
        this.loading = false
      },
    })
  }

  private resetForm(): void {
    this.isEditing = false
    this.editingPaymentId = null
    this.paymentForm.reset({
      SupplierId: "",
      NormalTeaLeafWeight: "",
      GoldenTipTeaLeafWeight: "",
      Rate: 200,
      GrossAmount: 0,
      IncentiveAddition: 0,
      NetAmount: 0,
      PaymentMethod: "Cash",
      PaymentDate: new Date().toISOString().split("T")[0],
      BankAccount: "",
    })
    this.resetSupplierData()
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

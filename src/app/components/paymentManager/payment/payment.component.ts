

import { Component,  OnInit,  AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder, FormGroup, Validators } from "@angular/forms"
import { HeaderComponent } from "../../header/header.component";

import  { Payment } from "../../../models/payment.model"
import  { Supplier } from "../../../models/supplier.model"
import  { PaymentService } from "../../../shared/services/payment.service"
import  { SupplierService } from "../../../shared/services/supplier.service"
import  { GreenLeafService } from "../../../shared/services/green-leaf.service"
import  { ExportService } from "../../../shared/services/export.service"
import  { PaymentCalculationResult } from "../../../models/payment-calculation.model"
import  { IncentiveService } from "../../../shared/services/incentive.service"
import { PaymentHistoryComponent } from "../payment-history/payment-history.component";

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  providers: [PaymentService, SupplierService, GreenLeafService, ExportService, IncentiveService , PaymentHistoryComponent],
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
  selectedStatus = "";
  customStartDate = ""
  customEndDate = ""
  searchTerm = ""

  // UI state
  showCalculator = false
  calculationResult: PaymentCalculationResult | null = null
  currentIncentiveQualityBonus = 0
  currentIncentiveLoyaltyBonus = 0
  currentIncentiveTotalAmount = 0
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
    private ExportService: ExportService,
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
    // The '+' operator ensures the supplierId is treated as a number for comparison
    const supplier = this.suppliers.find((s) => s.SupplierId === supplierId);
    
    if (supplier) {
      console.log('Found supplier for bank account:', supplier);
      this.currentSupplierBankAccount = supplier.BankAccount || "";
      this.paymentForm.get("BankAccount")?.setValue(this.currentSupplierBankAccount);
    } else {
      console.warn(`Could not find supplier with ID ${supplierId} in the local list.`);
      this.currentSupplierBankAccount = "";
      this.paymentForm.get("BankAccount")?.setValue("");
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
        this.paymentForm.get("IncentiveAddition")?.setValue(this.currentIncentiveTotalAmount)
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
  // editPayment(payment: Payment): void {
  //   this.isEditing = true
  //   this.editingPaymentId = payment.PaymentId

  //   this.paymentForm.patchValue({
  //     SupplierId: payment.SupplierId,
  //     NormalTeaLeafWeight: payment.NormalTeaLeafWeight,
  //     GoldenTipTeaLeafWeight: payment.GoldenTipTeaLeafWeight,
  //     Rate: payment.Rate,
  //     GrossAmount: payment.GrossAmount,
  //     IncentiveAddition: payment.IncentiveAddition,
  //     NetAmount: payment.NetAmount,
  //     PaymentMethod: payment.PaymentMethod,
  //     PaymentDate: new Date(payment.PaymentDate).toISOString().split("T")[0],
  //     BankAccount: payment.Supplier?.BankAccount || "",
  //   })
  // }


  editPayment(payment: Payment): void {
    console.log("Editing payment:", payment);
    this.isEditing = true;
    this.editingPaymentId = payment.PaymentId;

    // --- NEW, ROBUST LOGIC ---

    // Step 1: Set the SupplierId first. This will trigger the valueChanges subscription
    // which will automatically load the bank account and any available incentive.
    this.paymentForm.get('SupplierId')?.setValue(payment.SupplierId);

    // Step 2: Use a small timeout to allow the supplier data to load before patching the rest.
    // This ensures the incentive and bank account are loaded before we set the other values.
    setTimeout(() => {
      this.paymentForm.patchValue({
        NormalTeaLeafWeight: payment.NormalTeaLeafWeight,
        GoldenTipTeaLeafWeight: payment.GoldenTipTeaLeafWeight,
        Rate: payment.Rate,
        PaymentMethod: payment.PaymentMethod,
        PaymentDate: new Date(payment.PaymentDate).toISOString().split("T")[0],
        
        // IMPORTANT: Set the incentive value directly from the payment record being edited.
        // This is crucial because the incentive might have been used by THIS payment,
        // so we must show the historical value, not a new "available" one.
        IncentiveAddition: payment.IncentiveAddition || 0,
        BankAccount: payment.Supplier?.BankAccount || ""
      });

      // The updateCalculatedAmounts() method will be triggered by the patchValue,
      // correctly setting the GrossAmount and NetAmount.
    }, 100); // 100ms is usually enough time for the dependent data to load.

    // Scroll to the top of the page to show the form.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditing = false
    this.editingPaymentId = null
    this.resetForm()
  }

  // Search and filter functionality
  applyFilters(): void {
    if (!Array.isArray(this.payments)) {
        this.filteredPayments = [];
        return;
    }

    this.filteredPayments = this.payments.filter((payment) => {
        // ✨ FIX: Replace the old hardcoded logic with this flexible status filter
        const statusMatch = !this.selectedStatus || payment.Status === this.selectedStatus;

        // Search term filter (this logic is correct)
        const searchMatch =
            !this.searchTerm ||
            payment.PaymentId.toString().includes(this.searchTerm) ||
            payment.SupplierId.toString().includes(this.searchTerm) ||
            payment.PaymentMethod.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            payment.NetAmount.toString().includes(this.searchTerm) ||
            payment.Supplier?.Name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            payment.Supplier?.BankAccount?.includes(this.searchTerm);

        // Other filters (these are also correct)
        const supplierMatch = !this.selectedSupplier || payment.SupplierId.toString() === this.selectedSupplier;
        const methodMatch = !this.selectedPaymentMethod || payment.PaymentMethod === this.selectedPaymentMethod;
        let dateMatch = true;
        // ... (your existing date logic is correct and does not need to be changed) ...
        if (this.selectedDateRange === "custom" && this.customStartDate && this.customEndDate) {
            const paymentDate = new Date(payment.PaymentDate);
            const startDate = new Date(this.customStartDate);
            const endDate = new Date(this.customEndDate);
            dateMatch = paymentDate >= startDate && paymentDate <= endDate;
        } else if (this.selectedDateRange === "today") {
            const today = new Date();
            const paymentDate = new Date(payment.PaymentDate);
            dateMatch = paymentDate.toDateString() === today.toDateString();
        } else if (this.selectedDateRange === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const paymentDate = new Date(payment.PaymentDate);
            dateMatch = paymentDate >= weekAgo;
        } else if (this.selectedDateRange === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const paymentDate = new Date(payment.PaymentDate);
            dateMatch = paymentDate >= monthAgo;
        }


        // Return true only if ALL conditions are met
        return statusMatch && searchMatch && supplierMatch && methodMatch && dateMatch;
    });
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
  // exportPaymentsData(format: string): void {
  //   this.loading = true
  //   this.ExportService.exportPayments(format).subscribe({
  //     next: (blob) => {
  //       const filename = `payments-export.${format.toLowerCase()}`
  //       this.ExportService.downloadFile(blob, filename)
  //       this.loading = false
  //     },
  //     error: (err) => {
  //       console.error("Error exporting payments:", err)
  //       this.error = "Failed to export payments. Please try again."
  //       this.loading = false
  //     },
  //   })
  // }


   loadPendingPayments(): void {
    this.loading = true;
    this.error = null;
    // Call the new service method
    this.paymentService.getPendingPayments().subscribe({
      next: (data) => {
        // The data is already filtered by the backend, no client-side filter needed.
        this.payments = this.normalizePaymentData(data);
        this.applyFilters(); // This now operates on the pending list
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading pending payments:", err);
        this.error = "Failed to load pending payments.";
        this.loading = false;
      },
    });
  }

 exportPaymentsData(format: string): void {
  // ✨ Create a new list of only the PENDING payments from the current view
  const pendingPaymentsToExport = this.filteredPayments.filter(
    (p) => p.Status === 'Pending'
  );

  // ✨ Check the length of the new list
  if (pendingPaymentsToExport.length === 0) {
    alert('There are no pending payments in the current view to finalize.');
    return;
  }

  // ✨ Use the new list's length in the confirmation message
  if (
    !confirm(
      `This will finalize ${pendingPaymentsToExport.length} pending payment(s) in the current view and generate a payment sheet. This action cannot be undone. Are you sure?`
    )
  ) {
    return;
  }

  this.loading = true;
  this.error = null;

  // The rest of the function remains the same, as the backend
  // already correctly filters for pending payments.
  this.ExportService.exportPayments(
    format,
    this.customStartDate,
    this.customEndDate
  ).subscribe({
    next: (blob) => {
      console.log('Payment sheet generated successfully by the backend.');

      const filename = `payments-export-${
        new Date().toISOString().split('T')[0]
      }.${format.toLowerCase()}`;
      this.ExportService.downloadFile(blob, filename);

      this.loadPayments();
      this.loadSummaryMetrics();
    },
    error: (err) => {
      this.loading = false;
      this.error =
        'Failed to generate the payment sheet. No payments were finalized.';
      console.error('Error exporting payments:', err);
    },
  });
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
        Status: payment.Status || payment.status || 'Pending',
      }
    })
  }

  // loadPayments(): void {
  //   this.loading = true
  //   this.error = null
  //   this.paymentService.getPayments().subscribe({
  //     next: (data) => {
  //       console.log("Payments data received:", data)
  //       const paymentsArray = Array.isArray(data) ? data : []
  //       this.payments = this.normalizePaymentData(paymentsArray)
  //       console.log("Normalized payments:", this.payments)
  //       this.applyFilters()
  //       this.loading = false
  //     },
  //     error: (err) => {
  //       console.error("Error loading payments:", err)
  //       this.error = "Failed to load payments. Please try again later."
  //       this.loading = false
  //       this.payments = []
  //       this.filteredPayments = []
  //     },
  //   })
  // }

loadPayments(): void {
    this.loading = true; // This function takes control of the loading state.
    this.error = null;
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = this.normalizePaymentData(data);
        this.applyFilters(); // This is where `this.filteredPayments` is updated.
        this.loading = false; // Correctly sets loading to false upon completion.
      },
      error: (err) => {
        console.error("Error loading payments:", err);
        this.error = "Failed to load payments.";
        this.loading = false;
      },
    });
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
      Status : formValues.Status,
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



  

  // In your payment component

}

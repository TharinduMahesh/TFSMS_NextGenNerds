import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import  { Advance } from "../../../models/advance.model"
import  { Supplier } from "../../../models/supplier.model"
import  { AdvanceService } from "../../../shared/services/advance.service"
import  { SupplierService } from "../../../shared/services/supplier.service"
import  { ExportService } from "../../../shared/services/export.service"

@Component({
  selector: "app-advance",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./advance.component.html",
  styleUrls: ["./advance.component.css"],
})
export class AdvanceComponent implements OnInit {
  advances: Advance[] = []
  filteredAdvances: Advance[] = []
  suppliers: Supplier[] = []
  advanceTypes: string[] = ["All", "Cash", "Material", "Other"]
  selectedType = "All"
  selectedSupplier = ""
  advanceForm: FormGroup

  totalAdvances = 0
  totalOutstandingAmount = 0
  totalRecoveredAmount = 0

  loading = false
  error: string | null = null

  constructor(
    private advanceService: AdvanceService,
    private supplierService: SupplierService,
    private exportService: ExportService,
    private fb: FormBuilder,
  ) {
    this.advanceForm = this.fb.group({
      SupplierId: ["", Validators.required],
      AdvanceType: ["", Validators.required],
      Purpose: ["", Validators.required], // Changed from description
      AdvanceAmount: ["", [Validators.required, Validators.min(0.01)]], // Changed from amount
      IssueDate: [new Date().toISOString().split("T")[0], Validators.required],
      RecoveredAmount: [0],
      BalanceAmount: [{ value: "", disabled: true }, [Validators.required, Validators.min(0)]],
      RecoveryPercentage: [30, [Validators.required, Validators.min(1), Validators.max(100)]],
    })

    // Update balance amount when amount or recovered amount changes
    this.advanceForm.get("AdvanceAmount")?.valueChanges.subscribe((value) => {
      this.updateBalanceAmount()
    })

    this.advanceForm.get("RecoveredAmount")?.valueChanges.subscribe((value) => {
      this.updateBalanceAmount()
    })
  }

  ngOnInit(): void {
    this.loadAdvances()
    this.loadSuppliers()
    this.loadSummaryMetrics()
  }

  updateBalanceAmount(): void {
    const amount = this.advanceForm.get("AdvanceAmount")?.value || 0
    const recoveredAmount = this.advanceForm.get("RecoveredAmount")?.value || 0
    const balanceAmount = amount - recoveredAmount

    this.advanceForm.get("BalanceAmount")?.setValue(balanceAmount >= 0 ? balanceAmount : 0)
  }

  // Add this method to normalize the data
  private normalizeAdvanceData(advances: any[]): Advance[] {
    return advances.map((advance) => {
      // Handle both camelCase and PascalCase property names
      return {
        AdvanceId: advance.AdvanceId || advance.advanceId,
        SupplierId: advance.SupplierId || advance.supplierId,
        SupplierName: advance.SupplierName || advance.supplierName,
        AdvanceAmount: advance.AdvanceAmount || advance.advanceAmount || advance.amount,
        BalanceAmount: advance.BalanceAmount || advance.balanceAmount,
        Purpose: advance.Purpose || advance.purpose || advance.description,
        AdvanceType: advance.AdvanceType || advance.advanceType,
        RecoveredAmount: advance.RecoveredAmount || advance.recoveredAmount || 0,
        RecoveryPercentage: advance.RecoveryPercentage || advance.recoveryPercentage || 0,
        CreatedDate: advance.CreatedDate || advance.createdDate,
        Supplier: advance.Supplier || advance.supplier,
      }
    })
  }

  loadAdvances(): void {
    this.loading = true
    this.error = null

    this.advanceService.getAllAdvances().subscribe({
      next: (data) => {

        // Ensure data is an array
        const advancesArray = Array.isArray(data) ? data : []

        // Normalize the data to ensure consistent property names
        this.advances = this.normalizeAdvanceData(advancesArray)


        this.filteredAdvances = [...this.advances]
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading advances:", err)
        this.error = "Failed to load advances. Please try again later."
        this.loading = false
        this.advances = []
        this.filteredAdvances = []
      },
    })
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          this.suppliers = data
        } else {
          console.error("Expected array but got:", typeof data)
          this.suppliers = []
        }
      },
      error: (err) => {
        console.error("Error loading suppliers:", err)
        this.suppliers = []
      },
    })
  }

  loadSummaryMetrics(): void {
    this.advanceService.getTotalAdvancesCount().subscribe({
      next: (total) => {
        this.totalAdvances = typeof total === "number" ? total : 0
      },
      error: () => {
        this.totalAdvances = 0
      },
    })

    this.advanceService.getTotalOutstandingAmount().subscribe({
      next: (total) => {
        this.totalOutstandingAmount = typeof total === "number" ? total : 0
      },
      error: () => {
        this.totalOutstandingAmount = 0
      },
    })

    this.advanceService.getTotalRecoveredAmount().subscribe({
      next: (total) => {
        this.totalRecoveredAmount = typeof total === "number" ? total : 0
      },
      error: () => {
        this.totalRecoveredAmount = 0
      },
    })
  }

  filterAdvances(): void {
    if (!Array.isArray(this.advances)) {
      this.filteredAdvances = []
      return
    }

    this.filteredAdvances = this.advances.filter((advance) => {
      const typeMatch = this.selectedType === "All" || advance.AdvanceType === this.selectedType
      const supplierMatch = !this.selectedSupplier || advance.SupplierId.toString() === this.selectedSupplier
      return typeMatch && supplierMatch
    })
  }

  addAdvance(): void {
    if (this.advanceForm.invalid) {
      this.markFormGroupTouched(this.advanceForm)
      return
    }

    this.loading = true
    this.error = null

    const formValues = this.advanceForm.value
    const balanceAmount = formValues.AdvanceAmount - formValues.RecoveredAmount

    const advance: Advance = {
      AdvanceId: 0,
      SupplierId: formValues.SupplierId,
      AdvanceType: formValues.AdvanceType,
      Purpose: formValues.Purpose,
      AdvanceAmount: formValues.AdvanceAmount,
      RecoveredAmount: formValues.RecoveredAmount,
      BalanceAmount: balanceAmount,
    }

    this.advanceService.createAdvance(advance).subscribe({
      next: (result) => {
        this.loadAdvances()
        this.loadSummaryMetrics()
        this.resetForm()
        this.loading = false
      },
      error: (err) => {
        console.error("Error adding advance:", err)
        this.error = "Failed to add advance. Please try again."
        this.loading = false
      },
    })
  }

  exportAdvancesData(format: string): void {
    this.loading = true

    this.exportService.exportAdvances(format).subscribe({
      next: (blob) => {
        const filename = `advances-export.${format.toLowerCase()}`
        this.exportService.downloadFile(blob, filename)
        this.loading = false
      },
      error: (err) => {
        console.error("Error exporting advances:", err)
        this.error = "Failed to export advances. Please try again."
        this.loading = false
      },
    })
  }

  private resetForm(): void {
    this.advanceForm.reset({
      AdvanceType: "",
      IssueDate: new Date().toISOString().split("T")[0],
      RecoveredAmount: 0,
      RecoveryPercentage: 30,
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

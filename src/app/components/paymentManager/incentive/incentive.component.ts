import { Component,  OnInit,  OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder, FormGroup, Validators } from "@angular/forms"
import  { Subscription } from "rxjs"
import { HeaderComponent } from "../../header/header.component";

import  { Incentive } from "../../../models/incentive.model"
import  { Supplier } from "../../../models/supplier.model"
import  { IncentiveService } from "../../../shared/Services/incentive.service"
import  { SupplierService } from "../../../shared/Services/supplier.service"
import  { ExportService } from "../../../shared/Services/export.service"
import  { DataRefreshService } from "../../../shared/services/data-refresh.service"
import { ToastService } from "../../../shared/services/toast.service";
import { ConfirmationService } from "../../../shared/services/confirmation.service";

@Component({
  selector: "app-incentive",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: "./incentive.component.html",
  styleUrls: ["./incentive.component.css"],
})
export class IncentiveComponent implements OnInit, OnDestroy {
  incentives: Incentive[] = []
  filteredIncentives: Incentive[] = []
  suppliers: Supplier[] = []
  selectedSupplier = ""
  selectedMonth = ""
  incentiveForm: FormGroup
  totalIncentives = 0
  totalQualityBonus = 0
  totalLoyaltyBonus = 0
  loading = false
  error: string | null = null

  private refreshSubscription?: Subscription
  private autoRefreshInterval?: any

  constructor(
    private incentiveService: IncentiveService,
    private supplierService: SupplierService,
    private exportService: ExportService,
    private dataRefreshService: DataRefreshService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {
    this.incentiveForm = this.fb.group({
      SupplierId: ["", Validators.required],
      month: [new Date().toISOString().split("T")[0].substring(0, 7), Validators.required],
      qualityBonus: [0, [Validators.required, Validators.min(0)]],
      loyaltyBonus: [0, [Validators.required, Validators.min(0)]],
    })

    // Update total amount when quality or loyalty bonus changes
    this.incentiveForm.get("qualityBonus")?.valueChanges.subscribe(() => {
      this.updateTotalAmount()
    })
    this.incentiveForm.get("loyaltyBonus")?.valueChanges.subscribe(() => {
      this.updateTotalAmount()
    })
  }

  ngOnInit(): void {
    this.loadIncentives()
    this.loadSuppliers()
    this.loadSummaryMetrics()
    this.setupAutoRefresh()
    this.setupRefreshSubscription()
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe()
    }
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval)
    }
  }

  // Subscribe to refresh events from other components
  private setupRefreshSubscription(): void {
    this.refreshSubscription = this.dataRefreshService.incentiveRefresh$.subscribe(() => {
      console.log("Received incentive refresh signal")
      this.loadIncentives()
      this.loadSummaryMetrics()
    })
  }

  // Add auto-refresh functionality to catch updates from payment creation
  private setupAutoRefresh(): void {
    // Refresh data every 10 seconds for more responsive updates
    this.autoRefreshInterval = setInterval(() => {
      this.loadIncentives()
      this.loadSummaryMetrics()
    }, 10000)
  }

  updateTotalAmount(): void {
    const qualityBonus = this.incentiveForm.get("qualityBonus")?.value || 0
    const loyaltyBonus = this.incentiveForm.get("loyaltyBonus")?.value || 0
    // No need to set a form control, just calculate when needed
  }

  // Normalize the data to match the simplified structure
  private normalizeIncentiveData(incentives: any[]): Incentive[] {
    return incentives.map((incentive) => {
      return {
        IncentiveId: incentive.IncentiveId || incentive.incentiveId || 0,
        SupplierId: incentive.SupplierId || incentive.supplierId || 0,
        SupplierName: incentive.SupplierName || incentive.supplierName || "",
        QualityBonus: incentive.QualityBonus || incentive.qualityBonus || 0,
        LoyaltyBonus: incentive.LoyaltyBonus || incentive.loyaltyBonus || 0,
        TotalAmount: incentive.TotalAmount || incentive.totalAmount || 0,
        Month: incentive.Month || incentive.month || "",
        CreatedDate: new Date(incentive.CreatedDate || incentive.createdDate || new Date()),
        IsUsed: incentive.IsUsed !== undefined ? incentive.IsUsed : incentive.IsUsed || false,
      }
    })
  }

  loadIncentives(): void {
    this.loading = true
    this.error = null
    this.incentiveService.getAllIncentives().subscribe({
      next: (data) => {
        console.log("Raw incentives data:", data)
        const incentivesArray = Array.isArray(data) ? data : []
        this.incentives = this.normalizeIncentiveData(incentivesArray)
        console.log("Normalized incentives:", this.incentives)
        this.filteredIncentives = [...this.incentives]
        this.loading = false
      },
      error: (err) => {
        console.error("Error loading incentives:", err)
        this.error = "Failed to load incentives. Please try again later."
        this.loading = false
        this.incentives = []
        this.filteredIncentives = []
      },
    })
  }

  loadSuppliers(): void {
    this.supplierService.getActiveSuppliers().subscribe({
      next: (data) => {
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
    this.incentiveService.getTotalIncentivesCount().subscribe({
      next: (total) => {
        this.totalIncentives = typeof total === "number" ? total : 0
      },
      error: () => {
        this.totalIncentives = 0
      },
    })

    this.incentiveService.getTotalQualityBonusAmount().subscribe({
      next: (total) => {
        this.totalQualityBonus = typeof total === "number" ? total : 0
      },
      error: () => {
        this.totalQualityBonus = 0
      },
    })

    this.incentiveService.getTotalLoyaltyBonusAmount().subscribe({
      next: (total) => {
        this.totalLoyaltyBonus = typeof total === "number" ? total : 0
      },
      error: () => {
        this.totalLoyaltyBonus = 0
      },
    })
  }

  filterIncentives(): void {
    if (!Array.isArray(this.incentives)) {
      this.filteredIncentives = []
      return
    }

    this.filteredIncentives = this.incentives.filter((incentive) => {
      const supplierMatch = !this.selectedSupplier || incentive.SupplierId.toString() === this.selectedSupplier
      const monthMatch = !this.selectedMonth || incentive.Month === this.selectedMonth
      return supplierMatch && monthMatch
    })
  }

  addIncentive(): void {
    if (this.incentiveForm.invalid) {
      this.markFormGroupTouched(this.incentiveForm)
      return
    }

    this.loading = true
    this.error = null

    const formValues = this.incentiveForm.value
    const incentive: Incentive = {
      IncentiveId: 0,
      SupplierId: formValues.SupplierId,
      QualityBonus: formValues.qualityBonus,
      LoyaltyBonus: formValues.loyaltyBonus,
      TotalAmount: formValues.qualityBonus + formValues.loyaltyBonus,
      Month: formValues.month,
      CreatedDate: new Date(),
      IsUsed: false,
    }

    console.log("Sending incentive data:", incentive)

    this.incentiveService.createIncentive(incentive).subscribe({
      next: (result) => {
        console.log("Incentive created successfully:", result)
        this.loadIncentives()
        this.loadSummaryMetrics()
        this.resetForm()
        this.loading = false
      },
      error: (err) => {
        console.error("Error adding incentive:", err)
        this.error = "Failed to add incentive. Please try again."
        this.loading = false
      },
    })
  }

  exportIncentivesData(format: string): void {
    this.loading = true
    this.exportService.exportIncentives(format).subscribe({
      next: (blob) => {
        const filename = `incentives-export.${format.toLowerCase()}`
        this.exportService.downloadFile(blob, filename)
        this.loading = false
      },
      error: (err) => {
        console.error("Error exporting incentives:", err)
        this.error = "Failed to export incentives. Please try again."
        this.loading = false
      },
    })
  }

  private resetForm(): void {
    this.incentiveForm.reset({
      month: new Date().toISOString().split("T")[0].substring(0, 7),
      qualityBonus: 0,
      loyaltyBonus: 0,
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

   async deleteIncentive(incentiveId: number): Promise<void> {
  // Client-side check for immediate feedback (good UX)
  const incentive = this.incentives.find((i) => i.IncentiveId === incentiveId);
  if (incentive?.IsUsed) {
    // --- REPLACEMENT for this.error ---
    this.toastService.showWarning(
      'Action Not Allowed',
      'This incentive cannot be deleted because it has already been applied to a payment.'
    );
    return;
  }

  // --- REPLACEMENT for confirm() ---
  const confirmation = await this.confirmationService.confirm(
    'Are you sure you want to delete this incentive? This action cannot be undone.'
  );

  if (confirmation) {
    this.loading = true; // Still useful to show loading state on the component itself if needed

    // --- Optional: Add a loading toast for better feedback ---
    const loadingToastId = this.toastService.showLoading('Deleting...', 'Removing incentive record.');

    this.incentiveService.deleteIncentive(incentiveId).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.remove(loadingToastId); // Remove loading toast

        if (response.success) {
          // --- REPLACEMENT for this.error ---
          this.toastService.showSuccess('Success!', 'Incentive deleted successfully.');
          
          // Reload the data to remove the item from the UI list.
          this.loadIncentives();
          this.loadSummaryMetrics();
        } else {
          // --- REPLACEMENT for this.error ---
          // Show the specific error message from the backend.
          const errorMessage = response.message ?? 'An unknown error occurred.';
          this.toastService.showError('Delete Failed', errorMessage);
        }
      },
      error: (err) => { // This is for unexpected network/server errors
        this.loading = false;
        this.toastService.remove(loadingToastId); // Remove loading toast

        // --- REPLACEMENT for this.error ---
        this.toastService.showError(
          'System Error',
          'An unexpected network or server error occurred. Please try again.'
        );
        console.error("Critical error during incentive deletion:", err);
      },
    });
  }
}

  // Method to manually refresh data
  refreshData(): void {
    this.loadIncentives()
    this.loadSummaryMetrics()
  }
}



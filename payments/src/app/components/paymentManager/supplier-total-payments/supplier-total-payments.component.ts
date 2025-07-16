import { Component,  OnInit } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { FormsModule } from "@angular/forms" // Import FormsModule for ngModel
// Removed: import type { SupplierTotalPayment } from "../../../models/supplier-total-payment.model" // This is the summary DTO
import  { SupplierTotalPaymentRecord } from "../../../models/supplier-total-payment.model" // New record model
import  { SupplierTotalPaymentRecordService } from "../../../shared/services/supplier-total-payment-record.service"
import  { Supplier } from "../../../models/supplier.model" // Assuming you have a Supplier model
import  { SupplierService } from "../../../shared/services/supplier.service" // Assuming you have a SupplierService

@Component({
  selector: "app-supplier-total-payments",
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], // Add FormsModule and DatePipe
  templateUrl: "./supplier-total-payments.component.html",
  styleUrls: ["./supplier-total-payments.component.css"],
})
export class SupplierTotalPaymentsComponent implements OnInit {
  supplierRecords: SupplierTotalPaymentRecord[] = [] // Managed records from new service
  suppliers: Supplier[] = [] // List of all suppliers for dropdown

  // Removed: loadingSummaries = false
  loadingRecords = false
  loadingSuppliers = false
  // Removed: errorSummaries: string | null = null
  errorRecords: string | null = null
  errorSuppliers: string | null = null

  // For new record creation form
  newRecord: SupplierTotalPaymentRecord = {
    id: 0,
    supplierId: 0,
    supplierName: "",
    totalAmount: 0,
    status: "Pending",
    recordDate: new Date(),
    periodStartDate: new Date(),
    periodEndDate: new Date(),
    createdBy: "User", // Placeholder, replace with actual user
    createdDate: new Date(),
    updatedBy: "User", // Placeholder, replace with actual user
    updatedDate: new Date(),
  }
  isCreatingRecord = false

  constructor(
    // Removed: private paymentService: PaymentService,
    private supplierTotalPaymentRecordService: SupplierTotalPaymentRecordService,
    private supplierService: SupplierService, // Inject SupplierService
  ) {}

  ngOnInit(): void {
    // Removed: this.loadSupplierSummaries()
    this.loadSupplierRecords()
    this.loadSuppliers()
  }

  // Removed: loadSupplierSummaries() method

  loadSupplierRecords(): void {
    this.loadingRecords = true
    this.errorRecords = null
    this.supplierTotalPaymentRecordService.getSupplierTotalPaymentRecords().subscribe({
      next: (data) => {
        this.supplierRecords = data
        this.loadingRecords = false
      },
      error: (err) => {
        console.error("Error loading supplier records:", err)
        this.errorRecords = "Failed to load supplier records. Please try again later."
        this.loadingRecords = false
      },
    })
  }

  loadSuppliers(): void {
    this.loadingSuppliers = true
    this.errorSuppliers = null
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data
        this.loadingSuppliers = false
      },
      error: (err) => {
        console.error("Error loading suppliers:", err)
        this.errorSuppliers = "Failed to load suppliers. Please try again later."
        this.loadingSuppliers = false
      },
    })
  }

  onSupplierSelect(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value
    const selectedSupplier = this.suppliers.find((s) => s.SupplierId === selectedId)
    if (selectedSupplier) {
      this.newRecord.supplierId = selectedSupplier.SupplierId
      this.newRecord.supplierName = selectedSupplier.Name
      // Removed: Logic to pre-fill totalAmount from summary
    }
  }

  createRecord(): void {
    this.isCreatingRecord = true
    this.supplierTotalPaymentRecordService.createSupplierTotalPaymentRecord(this.newRecord).subscribe({
      next: (record) => {
        if (record) {
          this.supplierRecords.push(record)
          this.resetNewRecordForm()
          this.loadSupplierRecords() // Reload to ensure data consistency
        }
        this.isCreatingRecord = false
      },
      error: (err) => {
        console.error("Error creating record:", err)
        this.isCreatingRecord = false
        // Handle error display
      },
    })
  }

  updateRecordStatus(record: SupplierTotalPaymentRecord, newStatus: string): void {
    record.status = newStatus
    record.updatedDate = new Date()
    record.updatedBy = "User" // Placeholder
    this.supplierTotalPaymentRecordService.updateSupplierTotalPaymentRecord(record).subscribe({
      next: () => {
        console.log(`Record ${record.id} status updated to ${newStatus}`)
        this.loadSupplierRecords() // Reload to ensure history is updated and data is consistent
      },
      error: (err) => {
        console.error(`Error updating record ${record.id} status:`, err)
        // Revert status if update fails
        record.status = this.supplierRecords.find((r) => r.id === record.id)?.status || "Pending"
      },
    })
  }

  resetNewRecordForm(): void {
    this.newRecord = {
      id: 0,
      supplierId: 0,
      supplierName: "",
      totalAmount: 0,
      status: "Pending",
      recordDate: new Date(),
      periodStartDate: new Date(),
      periodEndDate: new Date(),
      createdBy: "User",
      createdDate: new Date(),
      updatedBy: "User",
      updatedDate: new Date(),
    }
  }
}

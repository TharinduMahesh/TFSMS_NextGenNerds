import { Component,  OnInit } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { FormsModule } from "@angular/forms" // Import FormsModule for ngModel
import { HeaderComponent } from "../../header/header.component";
import  { SupplierTotalPaymentRecord } from "../../../models/supplier-total-payment.model" // New record model
import  { SupplierTotalPaymentRecordService } from "../../../shared/Services/supplier-total-payment-record.service"
import  { Supplier } from "../../../models/supplier.model" // Assuming you have a Supplier model
import  { SupplierService } from "../../../shared/Services/supplier.service" // Assuming you have a SupplierService

@Component({
  selector: "app-supplier-total-payments",
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe,HeaderComponent], // Add FormsModule and DatePipe
  templateUrl: "./supplier-total-payments.component.html",
  styleUrls: ["./supplier-total-payments.component.css"],
})
export class SupplierTotalPaymentsComponent implements OnInit {
  supplierRecords: SupplierTotalPaymentRecord[] = [] // Managed records from new service
  suppliers: Supplier[] = [] // List of all suppliers for dropdown
  loadingRecords = false
  loadingSuppliers = false
  errorRecords: string | null = null
  errorSuppliers: string | null = null

  // For new record creation form
  newRecord: SupplierTotalPaymentRecord = {
    Id: 0,
    SupplierId: 0,
    SupplierName: "",
    TotalAmount: 0,
    Status: "Pending",
    PaymentMethod: "Bank Transfer", // Default payment method
    BankAccount: "", // Default bank account
    CreatedDate: new Date(),
  }
  isCreatingRecord = false

  constructor(
    private supplierTotalPaymentRecordService: SupplierTotalPaymentRecordService,
    private supplierService: SupplierService, // Inject SupplierService
  ) {}

  ngOnInit(): void {
    this.loadSupplierRecords()
    this.loadSuppliers()
  }

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
      this.newRecord.SupplierId = selectedSupplier.SupplierId
      this.newRecord.SupplierName = selectedSupplier.Name
      this.newRecord.BankAccount = selectedSupplier.BankAccount || "" // Set bank account
    } else {
      this.newRecord.SupplierId = 0
      this.newRecord.SupplierName = ""
      this.newRecord.BankAccount = ""
    }
  }

  createRecord(): void {
    this.isCreatingRecord = true
    // Ensure SupplierName is set before sending
    const selectedSupplier = this.suppliers.find((s) => s.SupplierId === this.newRecord.SupplierId)
    if (selectedSupplier) {
      this.newRecord.SupplierName = selectedSupplier.Name
    } else {
      this.errorRecords = "Please select a valid supplier."
      this.isCreatingRecord = false
      return
    }

    this.supplierTotalPaymentRecordService.createSupplierTotalPaymentRecord(this.newRecord).subscribe({
      next: (record) => {
        if (record) {
          this.supplierRecords.push(record)
          this.resetNewRecordForm()
          this.loadSupplierRecords() // Reload to ensure data consistency and proper display
        }
        this.isCreatingRecord = false
      },
      error: (err) => {
        console.error("Error creating record:", err)
        this.isCreatingRecord = false
        this.errorRecords = "Failed to create record. Please ensure all fields are valid and supplier exists."
      },
    })
  }

  updateRecordStatus(record: SupplierTotalPaymentRecord, newStatus: string): void {
    const originalStatus = record.Status // Store original status for rollback
    record.Status = newStatus
    this.supplierTotalPaymentRecordService.updateSupplierTotalPaymentRecord(record).subscribe({
      next: () => {
        console.log(`Record ${record.Id} status updated to ${newStatus}`)
        this.loadSupplierRecords() // Reload to ensure history is updated and data is consistent
      },
      error: (err) => {
        console.error(`Error updating record ${record.Id} status:`, err)
        this.errorRecords = `Failed to update status for record ${record.Id}.`
        record.Status = originalStatus // Revert status if update fails
      },
    })
  }

  exportRecords(format: string): void {
    this.loadingRecords = true
    this.errorRecords = null
    this.supplierTotalPaymentRecordService.exportSupplierTotalPaymentRecords(format).subscribe({
      next: (blob) => {
        const filename = `supplier-total-payments-export.${format.toLowerCase() === "excel" ? "csv" : format.toLowerCase()}`
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        this.loadingRecords = false
      },
      error: (err) => {
        console.error("Error exporting records:", err)
        this.errorRecords = "Failed to export records. Please try again."
        this.loadingRecords = false
      },
    })
  }

  resetNewRecordForm(): void {
    this.newRecord = {
      Id: 0,
      SupplierId: 0,
      SupplierName: "",
      TotalAmount: 0,
      Status: "Pending",
      PaymentMethod: "Bank Transfer",
      BankAccount: "",
      CreatedDate: new Date(),
    }
  }
}

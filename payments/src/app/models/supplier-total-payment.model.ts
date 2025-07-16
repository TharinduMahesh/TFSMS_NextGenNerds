export interface SupplierTotalPaymentRecord {
  id: number
  supplierId: number
  supplierName: string
  totalAmount: number
  status: string // "Pending", "Done", "Undone"
  createdDate: Date
}

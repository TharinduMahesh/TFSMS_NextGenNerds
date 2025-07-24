export interface SupplierTotalPaymentRecord {
  Id: number
  SupplierId: number
  SupplierName: string
  TotalAmount: number
  Status: string // "Pending", "Done", "Undone"
  CreatedDate: Date
  PaymentMethod?: string
  BankAccount?: string
}

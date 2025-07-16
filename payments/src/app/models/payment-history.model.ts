export interface PaymentHistory {
  historyId: number
  paymentId: number // Still relevant for history originating from a Payment
  sourceId?: number // New: ID of the source entity (e.g., SupplierTotalPaymentRecord.Id)
  sourceType?: string // New: Type of the source entity (e.g., "Payment", "SupplierTotalPaymentRecord")
  action: string
  actionDate: Date
  actionBy: string
  details: string
}

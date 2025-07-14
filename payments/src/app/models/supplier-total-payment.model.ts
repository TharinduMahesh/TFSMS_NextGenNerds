// models/supplier-total-payment.model.ts
export interface SupplierTotalPayment {
  supplierId: number // Corresponds to SupplierId in C# DTO
  supplierName: string // Corresponds to SupplierName in C# DTO
  totalAmountPaid: number // Corresponds to TotalAmountPaid in C# DTO (decimal in C# becomes number in TS)
}

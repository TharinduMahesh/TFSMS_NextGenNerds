// Updated Advance interface to match the C# DTO properties
export interface Advance {
  // Use PascalCase to match C# model properties
  AdvanceId: number
  SupplierId: number
  SupplierName?: string
  AdvanceAmount: number // Changed from amount
  BalanceAmount: number
  Purpose: string // Changed from description
  AdvanceType: string
  RecoveredAmount: number
  createdDate?: Date;
}

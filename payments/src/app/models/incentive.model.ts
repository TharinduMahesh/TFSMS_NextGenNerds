export interface Incentive {
  IncentiveId: number
  SupplierId: number // Changed from SupplierId to match backend casing convention
  QualityBonus: number
  LoyaltyBonus: number
  TotalAmount: number
  Month: string // Format: YYYY-MM
  Notes?: string
  CreatedBy?: string
  CreatedDate: Date

  // Optional navigation properties
  Supplier?: any
}

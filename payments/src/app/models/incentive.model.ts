export interface Incentive {
  IncentiveId: number
  SupplierId: number // Changed from SupplierId to match backend casing convention
  QualityBonus: number
  LoyaltyBonus: number
  TotalAmount: number

  // Optional navigation properties
}

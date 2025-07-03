export interface Incentive {
  IncentiveId: number
  SupplierId: number // Changed from SupplierId to match backend casing convention
  QualityBonus: number
  LoyaltyBonus: number
  TotalAmount: number
  createdDate : Date; // Added to match backend model

  // Optional navigation properties
}

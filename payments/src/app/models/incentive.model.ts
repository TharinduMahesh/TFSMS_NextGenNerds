export interface Incentive {
  IncentiveId: number
  SupplierId: number
  QualityBonus: number
  LoyaltyBonus: number
  TotalAmount: number
  Month: string
  CreatedDate: Date
  IsUsed: boolean; // Replaced UsedAmount and BalanceAmount
  // You might want a SupplierName for display purposes
  SupplierName?: string; 
}


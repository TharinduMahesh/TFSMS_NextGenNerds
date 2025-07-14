export interface Incentive {
  IncentiveId: number
  SupplierId: number
  QualityBonus: number
  LoyaltyBonus: number
  TotalAmount: number
  Month: string
  CreatedDate: Date
  UsedAmount : number 
  BalanceAmount : number// Amount used from the incentive
}

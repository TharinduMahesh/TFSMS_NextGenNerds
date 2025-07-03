export interface Payment {
  PaymentId: number
  SupplierId: number
  LeafWeight: number
  Rate: number
  GrossAmount: number
  AdvanceDeduction: number
  DebtDeduction: number
  IncentiveAddition: number
  NetAmount: number
  PaymentMethod: string
  PaymentDate: Date
  createdDate?: Date;
  
}

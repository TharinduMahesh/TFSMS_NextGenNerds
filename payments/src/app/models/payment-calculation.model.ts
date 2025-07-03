export interface PaymentCalculationRequest {
  supplierId: number
  leafWeight: number
  rate: number
  advanceDeduction?: number
  debtDeduction?: number
  incentiveAddition?: number
}

export interface PaymentCalculationResult {
  supplierId: number
  leafWeight: number
  rate: number
  grossAmount: number
  advanceDeduction: number
  debtDeduction: number
  incentiveAddition: number
  netAmount: number
  calculatedAt: Date
}

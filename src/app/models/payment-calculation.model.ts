export interface PaymentCalculationRequest {
  supplierId: number
 NormalTeaLeafWeight: number
  GoldenTipTeaLeafWeight: number
    rate: number
  incentiveAddition?: number
}

export interface PaymentCalculationResult {
  supplierId: number
 NormalTeaLeafWeight: number
  GoldenTipTeaLeafWeight: number
  rate: number
  grossAmount: number
  incentiveAddition: number
  netAmount: number
  calculatedAt: Date
}

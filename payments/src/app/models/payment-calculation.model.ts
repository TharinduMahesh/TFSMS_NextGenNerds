export interface PaymentCalculationRequest {
  supplierId: number;
  leafWeight: number;
  rate: number;
  includeAdvances: boolean;
  includeDebts: boolean;
  includeIncentives: boolean;
  advanceDeductionLimit?: number;
  debtDeductionLimit?: number;
}

export interface PaymentCalculationResult {
  grossAmount: number;
  advanceDeduction: number;
  debtDeduction: number;
  incentiveAddition: number;
  netAmount: number;
}
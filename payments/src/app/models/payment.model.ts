import { Supplier } from './supplier.model';
import { Receipt } from './receipt.model';
// import { PaymentHistory } from './payment-history.model';

// Update the Payment interface to match the C# model property names
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
  CreatedBy?: string
  CreatedDate?: Date
  Supplier: Supplier | null
  Receipts: Receipt[]
  // PaymentHistories: PaymentHistory[];
}

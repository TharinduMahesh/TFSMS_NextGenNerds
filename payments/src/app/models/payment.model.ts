import { Supplier } from './supplier.model';
import { Receipt } from './receipt.model';
// import { PaymentHistory } from './payment-history.model';

export interface Payment {
  paymentId: number;
  SupplierId: number;
  leafWeight: number;
  rate: number;
  grossAmount: number;
  advanceDeduction: number;
  debtDeduction: number;
  incentiveAddition: number;
  netAmount: number;
  paymentMethod: string;
  paymentDate: Date;
  createdBy?: string;
  createdDate?: Date;
  supplier: Supplier | null;
  receipts: Receipt[];
  // paymentHistories: PaymentHistory[];
}
import { Supplier } from './supplier.model';
import { Payment } from './payment.model';

export interface Receipt {
  receiptNumber: string;
  date: Date;
  supplier: Supplier;
  payment: Payment;
  totalDeductions: number;
  receiptDetails: {
    issuedBy: string;
    timestamp: Date;
    notes: string;
  };
}
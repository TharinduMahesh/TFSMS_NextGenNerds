import { SalesCharge } from './salesCharge.model';

export interface CreateInvoicePayload {
  stockLedgerEntryId: number;
  brokerName?: string;
  invoiceDate: string;
}

export interface InvoiceResponse {
  invoiceId: number;
  invoiceNumber: string;
  stockLedgerEntryId: number;
  invoiceDate: string;
  status: string;
  teaGrade?: string;
  gardenMark?: string;
  weightKg?: number;
  brokerName?: string;
  buyerName?: string;
  soldPricePerKg?: number;
  totalAmount?: number;
  salesCharges: SalesCharge[];
}

export interface FinalizeSalePayload {
  invoiceId: number;
  buyerName: string;
  soldPricePerKg: number;
  salesCharges: SalesChargePayload[];
}

export interface SalesChargePayload {
  chargeType: string;
  amount: number;
}
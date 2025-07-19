// Payload for creating a new invoice
export interface CreateInvoicePayload {
  stockLedgerEntryId: number;
  brokerName?: string;
  invoiceDate: string;
}

// ==========================================================
//           ↓↓↓ THE CORRECTION IS IN THIS INTERFACE ↓↓↓
// ==========================================================
export interface InvoiceResponse {
  invoiceId: number;
  invoiceNumber: string;       // Corrected to camelCase
  stockLedgerEntryId: number;
  invoiceDate: string;
  status: string;
  teaGrade?: string;
  gardenMark?: string;
  weightKg?: number;          // Corrected to camelCase
  brokerName?: string;        // Corrected to camelCase
}
// ==========================================================
//                 END OF CORRECTION
// ==========================================================

// Payload to FINALIZE a sale for an existing invoice
export interface FinalizeSalePayload {
  invoiceId: number;
  buyerName: string;
  soldPricePerKg: number;
  salesCharges: SalesChargePayload[];
}

// Sub-model for charges within the finalize payload
export interface SalesChargePayload {
  chargeType: string;
  amount: number;
}
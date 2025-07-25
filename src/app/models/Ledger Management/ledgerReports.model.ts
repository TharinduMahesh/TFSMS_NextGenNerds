// ==========================================================
// Models for the Ledger Reporting Pages
// ==========================================================

// For the Sales Register Report
export interface SalesRegisterReport {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  buyerName: string;
  teaGrade: string;
  weightKg: number;
  soldPricePerKg: number;
  totalAmount: number;
}

// For the Dispatch Register Report
export interface DispatchRegisterReport {
  dispatchId: number;
  dispatchDate: string;
  invoiceNumber: string;
  vehicleNumber: string;
  driverName: string;
  bagCount: number;
}

// Note: For the "Unsold Tea Report", we can reuse the
// StockLedgerResponse interface from the stock-ledger.model.ts file.
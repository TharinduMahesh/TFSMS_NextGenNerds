// src/app/models/stock-ledger-entry.interface.ts

/**
 * @interface StockLedgerEntry
 * @description Defines the structure for a single Stock Ledger Entry record in the frontend.
 * This mirrors the StockLedgerEntry model from your .NET backend.
 */
export interface StockLedgerEntry {
  stockLedgerEntryId?: number; // Primary key, optional for creation
  packedTeaId: number; // Foreign Key to PackedTea
  status: string; // e.g., "Unsold", "Invoiced", "Sold"
  currentWeightKg: number;
  invoiceId?: number; // Nullable Foreign Key to Invoice
  createdAt?: string;
  updatedAt?: string;

  // NEW: Include PackedTea and Invoice navigation properties for display purposes
  // These will be populated by backend includes (e.g., in StockLedgerEntriesController)
  packedTea?: {
    packedTeaId: number;
    grade: string;
    gardenMark: string;
    packingDate: string; // YYYY-MM-DD format
    initialWeightKg: number;
  };
  invoice?: {
    invoiceId: number;
    invoiceNumber: string;
    invoiceDate: string; // YYYY-MM-DD format
    brokerName: string;
  };
}

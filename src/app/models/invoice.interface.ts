// src/app/models/invoice.interface.ts

/**
 * @interface Invoice
 * @description Defines the structure for a single Invoice record in the frontend.
 * This mirrors the Invoice model from your .NET backend.
 */
export interface Invoice {
  invoiceId?: number; // Primary key, optional for creation
  invoiceNumber: string;
  stockLedgerEntryId: number; // Foreign Key to StockLedgerEntry
  brokerName: string;
  invoiceDate: string; // YYYY-MM-DD format
  status: string; // e.g., "Pending", "Invoiced", "Dispatched", "Paid"
  soldPricePerKg: number;
  totalAmount: number;
  buyerName: string | null; // DEFINITIVE FIX: Made nullable
  createdAt?: string | null; // FIX: Can be string or null
  updatedAt?: string | null; // FIX: Can be string or null

  // NEW: Include navigation properties for display purposes
  stockLedgerEntry?: { // Details of the packed tea linked to this invoice
    stockLedgerEntryId: number;
    packedTeaId: number;
    status: string; // Status of the stock item itself
    currentWeightKg: number;
    invoiceId?: number | null; // FIX: Make nullable
    packedTea?: { // Nested packed tea details
      packedTeaId: number;
      grade: string | null; // FIX: Make nullable
      gardenMark: string;
      packingDate: string;
      initialWeightKg: number;
    };
  } | null; // FIX: stockLedgerEntry itself can be null

  salesEntries?: { // Line items of this invoice
    id?: number; // FIX: Make optional
    invoiceId?: number | null; // FIX: Make nullable
    invoiceNumber: string;
    saleDate: string;
    customerName: string;
    teaGrade: string;
    quantityKg: number;
    unitPriceKg: number;
    totalAmount: number;
    remarks?: string | null; // FIX: Make nullable
    createdAt?: string | null; // FIX: Make nullable
    updatedAt?: string | null; // FIX: Make nullable
  }[] | null; // FIX: salesEntries itself can be null

  // UPDATED: Sales charges to match database structure exactly
  salesCharges?: { // Sales charges linked to this invoice - matches DB table
    salesChargeId?: number; // Primary key from DB
    invoiceId?: number; // Foreign key to Invoice (not null in DB)
    saleReference?: string | null; // Can be null based on your interface
    chargeType: string; // Required field in DB
    amount: number; // Required decimal field in DB
    chargeDate?: string | null; // DateTime in DB, can be null
    description?: string | null; // Can be null
    createdAt?: string | null; // Auto-generated timestamp
    updatedAt?: string | null; // Auto-generated timestamp
  }[] | null; // Array can be null/undefined

  dispatches?: { // Dispatches linked to this invoice
    dispatchId?: number; // FIX: Make optional
    invoiceId: number;
    vehicleNumber: string;
    dispatchDate: string;
    driverName: string;
    driverNic?: string | null; // FIX: Make nullable
    sealNumber?: string | null; // FIX: Make nullable
    bagCount: number;
    dispatchedWeightKg: number;
    createdAt?: string | null; // FIX: Make nullable
    updatedAt?: string | null; // FIX: Make nullable
  }[] | null; // FIX: dispatches itself can be null
}

// NEW: Add a separate interface specifically for creating invoices (cleaner for API calls)
export interface InvoiceCreateRequest {
  invoiceNumber: string;
  stockLedgerEntryId: number;
  brokerName: string;
  invoiceDate: string;
  status?: string; // Optional, backend sets default
  soldPricePerKg: number;
  totalAmount: number;
  buyerName?: string | null;
}

// NEW: Add a separate interface for invoice list/display (lighter weight)
export interface InvoiceListItem {
  invoiceId: number;
  invoiceNumber: string;
  brokerName: string;
  invoiceDate: string;
  status: string;
  totalAmount: number;
  buyerName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// NEW: Detailed interface for full invoice with all relationships
export interface InvoiceDetails extends Invoice {
  // Force these to be non-null when we're getting full details
  stockLedgerEntry: NonNullable<Invoice['stockLedgerEntry']>;
  salesCharges: NonNullable<Invoice['salesCharges']>;
  salesEntries: NonNullable<Invoice['salesEntries']>;
}
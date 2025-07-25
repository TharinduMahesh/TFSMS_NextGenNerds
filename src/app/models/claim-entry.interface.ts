// src/app/models/claim-entry.interface.ts
export interface ClaimEntry {
claimNo?: any;
  id?: number; // Primary key, optional for creation (generated by backend)
  claimType: string;
  invoiceNumber: string;
  quantity: number;
  returnDate: string; // Stored as ISO string (YYYY-MM-DD) for consistency
  remark: string;
  resolutionType?: string;
}
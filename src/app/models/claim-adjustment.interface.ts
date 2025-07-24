// src/app/models/claim-adjustment.interface.ts
export interface ClaimAdjustment {
  id?: number; // Primary key for the adjustment, optional for creation
  claimReference: string; // Reference to the original claim
  adjustmentType: string; // e.g., "Full Credit", "Reshipment"
  adjustmentDetails: string; // Detailed description
  adjustmentDate: string; // ISO string (YYYY-MM-DD)
  resolutionType?: string;
}

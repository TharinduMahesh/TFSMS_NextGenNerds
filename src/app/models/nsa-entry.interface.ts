// src/app/models/nsa-report.interface.ts

/**
 * @interface NsaEntry
 * @description Defines the structure for a single NSA (Net Sales Average) report entry.
 * This mirrors the NsaEntry model from your .NET backend's aggregated data.
 */
export interface NsaEntry {
  id?: number; // Unique ID for the report row
  entryDate: string; // YYYY-MM-DD format (date of the month's summary)
  monthlyKilosSold: number; // Total gross kilos for the month
  proceeds: number; // Total gross proceeds for the month
  adjustedKilos: number; // Sum of kilos from returns, claims, gratis issues
  adjustedProceeds: number; // Sum of proceeds from returns, claims, gratis issues
  nsaValue: number; // Calculated Net Sales Average
  monthYear?: string;
}

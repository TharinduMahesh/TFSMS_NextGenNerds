// src/app/models/monthly-nsa-summary.interface.ts
export interface MonthlyNsaSummary {
  monthYear: string; // e.g., "2025-01"
  totalAdjustedKilos: number;
  totalAdjustedProceeds: number;
  monthlyNsaValue: number;
}

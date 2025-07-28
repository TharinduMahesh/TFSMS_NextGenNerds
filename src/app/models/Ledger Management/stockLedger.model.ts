
export interface CreatePackedTeaPayload { 
  grade: string;
  gardenMark: string;
  financialYear: number;
  packingType: string;
  weightKg: number;
  packingDate: string; // Sent as a string, e.g., '2024-10-15T10:00:00'
}

// This is the data you RECEIVE from the API when you view the stock ledger
// Matches the StockLedgerResponseDto in your backend
export interface StockLedgerResponse {
  stockLedgerEntryId: number;
  packedTeaId: number;
  grade: string;
  gardenMark: string;
  financialYear: number;
  packingType: string;
  initialWeightKg: number;
  currentWeightKg: number;
  packingDate: string;
  status: string; // e.g., "Unsold", "Invoiced", "Sold"
}
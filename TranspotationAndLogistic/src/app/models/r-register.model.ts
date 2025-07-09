// src/app/features/return-register/return-register.model.ts

export interface ReturnRegisterRecord {
  id: number;
  returnDate: string; // Using 'YYYY-MM-DD' format
  season: string;
  reason: string;
  invoice: string;
  kilosReturned: number;
  remarks: string;
}

// Interface for the filter object
export interface ReturnRegisterFilter {
  date: string;
  season: string;
  reason: string;
  invoice: string;
}
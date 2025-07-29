// src/app/models/return-entry.interface.ts
export interface ReturnEntry {
  id?: number;
  season: string;
  gardenMark: string;
  invoiceNumber: string;
  returnDate: string;
  kilosReturned: number;
  reason: string;
  createdAt?: string;
  updatedAt?: string;
}
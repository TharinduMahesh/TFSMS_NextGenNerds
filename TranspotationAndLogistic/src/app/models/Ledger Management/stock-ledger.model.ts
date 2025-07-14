// src/app/models/stock-ledger.model.ts

export interface StockLedgerRecord {
  id: number;
  date: string;
  grade: string;
  gardenMark: string;
  financialYear: string;
  packingType: string;
  quantityIn: number;
  quantityOut: number;
  remarks: string;
}

export interface StockLedgerFilter {
  grade: string;
  gardenMark: string;
  financialYear: string;
  packingType: string;
}
export interface StockLedger {
  id?: string;
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
  grade?: string;
  gardenMark?: string;
  financialYear?: string;
  packingType?: string;
}

export const STOCK_PACKING_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'All Packing Type' },
  { value: 'bulk', label: 'Bulk' },
  { value: 'retail', label: 'Retail' },
  { value: 'loose', label: 'Loose Tea' },
  { value: 'bags', label: 'Tea Bags' },
  { value: 'boxes', label: 'Tea Boxes' },
  { value: 'pouches', label: 'Tea Pouches' }
];
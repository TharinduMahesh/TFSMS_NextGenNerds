export interface TeaReturnRecord {
  id: number;
  returnNo: number;
  season: string;
  reason: string;
  gardenMark: string;
  invoiceNumber: string;
  kilosReturned: number;
  returnDate: string; // Using string for 'YYYY-MM-DD' date format
}
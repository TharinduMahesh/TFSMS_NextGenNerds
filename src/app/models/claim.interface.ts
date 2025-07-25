export interface Claim {
  id: number;
  season: string;
  gardenMark: string;
  invoice: string;
  returnDate: string;
  kilosReturned: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}
export interface Invoice {
  id: string;          // Unique ID for tracking in lists
  invoiceNo: string;   // A generated invoice number
  season: string;
  brokerName: string;
  grade: string;
  packingType: string;
  bulkType: 'Bulk' | 'Bag' | 'Box'; // Example types
  dispatchDate: string; // Storing as string for simplicity, can be Date object
}
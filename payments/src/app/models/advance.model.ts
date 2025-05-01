export interface Advance {
  advanceId: number;
  supplierId: number;
  advanceAmount: number;
  balanceAmount: number;
  purpose: string;
  issueDate: Date;
  createdBy?: string;
  createdDate?: Date;
  
  // Optional navigation properties
  supplier?: any;
}
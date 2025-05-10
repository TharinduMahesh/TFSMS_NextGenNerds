export interface Advance {
  advanceId: number;
  supplierId: number;
  advanceType: string;     // Added this property
  description: string;     // Changed from purpose to description
  amount: number;          // Changed from advanceAmount
  recoveredAmount: number; // Added this property
  balanceAmount: number;
  recoveryPercentage: number; // Added this property
  status: string;          // Added this property
  issueDate: Date;
  createdBy?: string;
  createdDate?: Date;
  
  // Optional navigation properties
  supplier?: any;
}
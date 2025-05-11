export interface Debt {
  debtId: number;
  SupplierId: number;
  debtType: string;         // Added this property
  description: string;      // Added this property
  totalAmount: number;      // Added this property
  balanceAmount: number;
  deductionsMade: number;
  deductionPercentage: number; // Added this property
  status: string;           // Added this property
  issueDate: Date;
  createdBy?: string;
  createdDate?: Date;
  
  // Optional navigation properties
  supplier?: any;
}
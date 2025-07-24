export interface Debt {
  debtId: number;
  SupplierId: number;
  debtType: string;         // Added this property
  description: string;      // Added this property
  totalAmount: number;  
  issueDate : Date;    // Added this property
  balanceAmount: number;
  deductionsMade: number;
  deductionPercentage: number; // Added this property
  
  // Optional navigation properties
  supplier?: any;
}
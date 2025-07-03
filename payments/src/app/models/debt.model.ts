export interface Debt {
  debtId: number;
  SupplierId: number;
  debtType: string;         // Added this property
  description: string;      // Added this property
  totalAmount: number;      // Added this property
  balanceAmount: number;
  deductionsMade: number;
  deductionPercentage: number; // Added this property
  createdDate?: Date;
  
  // Optional navigation properties
  supplier?: any;
}
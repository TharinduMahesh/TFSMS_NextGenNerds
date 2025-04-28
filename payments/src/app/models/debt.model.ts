export interface Debt {
    debtId: number;
    supplierId: number;
    balanceAmount: number;
    deductionsMade: number;
    description: string;
    issueDate: Date;
    createdBy?: string;
    createdDate?: Date;
    
    // Optional navigation properties
    supplier?: any;
  }
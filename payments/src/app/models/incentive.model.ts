export interface Incentive {
    incentiveId: number;
    supplierId: number;
    qualityBonus: number;
    loyaltyBonus: number;
    month: string;
    year: number;
    createdBy?: string;
    createdDate?: Date;
    
    // Optional navigation properties
    supplier?: any;
  }
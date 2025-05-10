export interface Incentive {
  incentiveId: number;
  supplierId: number;
  qualityBonus: number;
  loyaltyBonus: number;
  totalAmount: number;  // Added this property
  month: string;        // Format: YYYY-MM
  notes?: string;       // Added this property
  createdBy?: string;
  createdDate: Date;    // Changed to non-optional since it's used in the component
  
  // Optional navigation properties
  supplier?: any;
}
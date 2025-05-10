export interface Payment {
  paymentId: number;
  supplierId: number;
  leafWeight: number;
  rate: number;
  grossAmount: number;
  advanceDeduction: number;
  debtDeduction: number;
  incentiveAddition: number;
  netAmount: number;
  paymentMethod: string;
  paymentDate: Date;
  createdBy?: string;
  createdDate?: Date;
  
  // Optional navigation properties
  supplier?: any;
}
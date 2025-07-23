import type { Supplier } from "./supplier.model"

export interface Payment {
  Status: string
  PaymentId: number
  SupplierId: number
  NormalTeaLeafWeight: number
  GoldenTipTeaLeafWeight: number
  Rate: number
  GrossAmount: number
  IncentiveAddition: number
  NetAmount: number
  PaymentMethod: string
  PaymentDate: Date
  createdDate?: Date;
  BankAccount?: string
    Supplier?: Supplier


  
}
 // Assuming Supplier model is in supplier.model.ts



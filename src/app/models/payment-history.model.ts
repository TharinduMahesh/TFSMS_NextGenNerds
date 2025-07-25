export interface PaymentHistory {
  HistoryId: number
  PaymentId?: number // Made nullable
  SupplierId: number // Already present in your model
  Action: string // Renamed from 'action' to match C# casing
  ActionDate: Date // Renamed from 'actionDate' to match C# casing
  Details: string // Renamed from 'details' to match C# casing
  ActionBy: string // New field
}
// src/app/models/payment-history.model.ts

// This interface defines a single entry in the payment history log.

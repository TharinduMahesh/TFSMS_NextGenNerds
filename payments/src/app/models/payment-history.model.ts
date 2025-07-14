// models/payment-history.model.ts
export interface PaymentHistory {
  historyId: number // Corresponds to HistoryId in C# model
  paymentId: number // Corresponds to PaymentId in C# model
  action: string // Corresponds to Action in C# model
  details: string // Corresponds to Details in C# model
  actionBy: string // Corresponds to ActionBy in C# model
  actionDate: string // Corresponds to ActionDate (DateTime) in C# model, typically sent as ISO string
}

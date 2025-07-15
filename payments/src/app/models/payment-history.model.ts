export interface PaymentHistory {
  historyId: number
  paymentId: number
  action: string
  details: string
  actionBy: string
  actionDate: string // ISO string date
}

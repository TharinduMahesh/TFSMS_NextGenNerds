import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, forkJoin, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import { environment } from "../../shared/environments/environment"

export interface PaymentAutoFillData {
  supplierId: number
  supplierName: string
  leafWeight: number
  advanceDeduction: number
  debtDeduction: number
  incentiveAddition: number
  hasActiveAdvances: boolean
  hasActiveDebts: boolean
  hasCurrentIncentives: boolean
}

@Injectable({
  providedIn: "root",
})
export class PaymentAutoFillService {
  private apiUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  getPaymentAutoFillData(supplierId: number): Observable<PaymentAutoFillData> {
    // Fetch all required data in parallel
    const greenLeafWeight$ = this.http.get<number>(`${this.apiUrl}/api/greenleaf/supplier/${supplierId}/latest-weight`)
    const activeAdvances$ = this.http.get<any[]>(`${this.apiUrl}/api/advances/supplier/${supplierId}`)
    const activeDebts$ = this.http.get<any[]>(`${this.apiUrl}/api/debts/supplier/${supplierId}`)
    const currentIncentives$ = this.http.get<any>(`${this.apiUrl}/api/incentives/supplier/${supplierId}/current`)
    const supplier$ = this.http.get<any>(`${this.apiUrl}/api/suppliers/${supplierId}`)

    return forkJoin({
      leafWeight: greenLeafWeight$.pipe(catchError(() => of(0))),
      advances: activeAdvances$.pipe(catchError(() => of([]))),
      debts: activeDebts$.pipe(catchError(() => of([]))),
      incentives: currentIncentives$.pipe(catchError(() => of(null))),
      supplier: supplier$.pipe(catchError(() => of({ Name: "Unknown" }))),
    }).pipe(
      map((data) => {
        // Calculate total active advance amount (for deduction)
        const activeAdvances = Array.isArray(data.advances)
          ? data.advances.filter((a) => a.Status === "Active" || a.status === "Active")
          : []
        const totalAdvanceDeduction = activeAdvances.reduce((sum, advance) => {
          const balanceAmount = advance.BalanceAmount || advance.balanceAmount || 0
          // Calculate 30% of balance amount for deduction (or use recovery percentage)
          const recoveryPercentage = advance.RecoveryPercentage || advance.recoveryPercentage || 30
          return sum + balanceAmount * (recoveryPercentage / 100)
        }, 0)

        // Calculate total active debt amount (for deduction)
        const activeDebts = Array.isArray(data.debts)
          ? data.debts.filter((d) => d.Status === "Active" || d.status === "Active")
          : []
        const totalDebtDeduction = activeDebts.reduce((sum, debt) => {
          const balanceAmount = debt.BalanceAmount || debt.balanceAmount || 0
          // Calculate deduction percentage of balance amount
          const deductionPercentage = debt.DeductionPercentage || debt.deductionPercentage || 20
          return sum + balanceAmount * (deductionPercentage / 100)
        }, 0)

        // Get current month incentive amount
        const incentiveAddition = data.incentives ? data.incentives.TotalAmount || data.incentives.totalAmount || 0 : 0

        return {
          supplierId: supplierId,
          supplierName: data.supplier.Name || data.supplier.name || "Unknown",
          leafWeight: data.leafWeight || 0,
          advanceDeduction: Math.round(totalAdvanceDeduction * 100) / 100, // Round to 2 decimal places
          debtDeduction: Math.round(totalDebtDeduction * 100) / 100,
          incentiveAddition: Math.round(incentiveAddition * 100) / 100,
          hasActiveAdvances: activeAdvances.length > 0,
          hasActiveDebts: activeDebts.length > 0,
          hasCurrentIncentives: !!data.incentives,
        }
      }),
      catchError((error) => {
        console.error("Error fetching payment auto-fill data:", error)
        return of({
          supplierId: supplierId,
          supplierName: "Unknown",
          leafWeight: 0,
          advanceDeduction: 0,
          debtDeduction: 0,
          incentiveAddition: 0,
          hasActiveAdvances: false,
          hasActiveDebts: false,
          hasCurrentIncentives: false,
        })
      }),
    )
  }

  processPaymentDeductions(paymentData: any): Observable<boolean> {
    const requests: Observable<any>[] = []

    // Process advance deductions
    if (paymentData.advanceDeduction > 0) {
      const advanceDeduction$ = this.http.post(`${this.apiUrl}/api/payments/process-advance-deductions`, {
        supplierId: paymentData.SupplierId,
        deductionAmount: paymentData.advanceDeduction,
        paymentId: paymentData.PaymentId,
      })
      requests.push(advanceDeduction$)
    }

    // Process debt deductions
    if (paymentData.debtDeduction > 0) {
      const debtDeduction$ = this.http.post(`${this.apiUrl}/api/payments/process-debt-deductions`, {
        supplierId: paymentData.SupplierId,
        deductionAmount: paymentData.debtDeduction,
        paymentId: paymentData.PaymentId,
      })
      requests.push(debtDeduction$)
    }

    // Process incentive usage
    if (paymentData.incentiveAddition > 0) {
      const incentiveUsage$ = this.http.post(`${this.apiUrl}/api/payments/process-incentive-usage`, {
        supplierId: paymentData.SupplierId,
        incentiveAmount: paymentData.incentiveAddition,
        paymentId: paymentData.PaymentId,
      })
      requests.push(incentiveUsage$)
    }

    if (requests.length === 0) {
      return of(true)
    }

    return forkJoin(requests).pipe(
      map(() => true),
      catchError((error) => {
        console.error("Error processing payment deductions:", error)
        return of(false)
      }),
    )
  }
}

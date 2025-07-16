// import { Injectable } from "@angular/core"
// import  { HttpClient } from "@angular/common/http"
// import {  Observable, catchError, map, of } from "rxjs"
// import  { Debt } from "../../models/debt.model"
// import { environment } from "../../shared/environments/environment"

// @Injectable({
//   providedIn: "root",
// })
// export class DebtService {
//   private apiUrl = `${environment.apiBaseUrl}/api/debts`

//   constructor(private http: HttpClient) {}

//   getAllDebts(): Observable<Debt[]> {
//     console.log("Fetching debts from:", this.apiUrl)
//     return this.http.get<any>(this.apiUrl).pipe(
//       map((response) => {
//         console.log("Raw API response for debts:", response)
//         // Handle the response based on its structure
//         if (Array.isArray(response)) {
//           console.log("Response is an array with length:", response.length)
//           return response
//         } else if (response && typeof response === "object") {
//           // If the response is an object, extract the data
//           if (Array.isArray(response.data)) {
//             console.log("Response has data array with length:", response.data.length)
//             return response.data
//           } else if (response.data) {
//             console.log("Response has data object, converting to array")
//             return [response.data]
//           } else {
//             // Check if the response itself might be a single debt object
//             if (response.debtId !== undefined || response.DebtId !== undefined) {
//               console.log("Response appears to be a single debt object, converting to array")
//               return [response]
//             }
//             // Last resort: try to extract any array-like property from the response
//             const possibleArrayProps = Object.keys(response).filter(
//               (key) =>
//                 Array.isArray(response[key]) &&
//                 response[key].length > 0 &&
//                 (response[key][0].debtId !== undefined || response[key][0].DebtId !== undefined),
//             )
//             if (possibleArrayProps.length > 0) {
//               console.log(`Found possible debts array in property: ${possibleArrayProps[0]}`)
//               return response[possibleArrayProps[0]]
//             }
//             console.log("Could not find debts data in response, returning empty array")
//             return []
//           }
//         }
//         console.log("Response format not recognized, returning empty array")
//         return []
//       }),
//       catchError((error) => {
//         console.error("Error fetching all debts:", error)
//         return of([])
//       }),
//     )
//   }

//   getDebt(id: number): Observable<Debt | null> {
//     return this.http.get<Debt>(`${this.apiUrl}/${id}`).pipe(
//       catchError((error) => {
//         console.error(`Error fetching debt with id ${id}:`, error)
//         return of(null)
//       }),
//     )
//   }

//   getDebtsBySupplier(supplierId: number): Observable<Debt[]> {
//     return this.http.get<any>(`${this.apiUrl}/supplier/${supplierId}`).pipe(
//       map((response) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response && typeof response === "object") {
//           return Array.isArray(response.data) ? response.data : [response]
//         }
//         return []
//       }),
//       catchError((error) => {
//         console.error(`Error fetching debts for supplier ${supplierId}:`, error)
//         return of([])
//       }),
//     )
//   }

//   createDebt(debt: Debt): Observable<Debt | null> {
//     return this.http.post<Debt>(this.apiUrl, debt).pipe(
//       catchError((error) => {
//         console.error("Error creating debt:", error)
//         return of(null)
//       }),
//     )
//   }

//   updateDebt(debt: Debt): Observable<Debt | null> {
//     return this.http.put<Debt>(`${this.apiUrl}/${debt.debtId}`, debt).pipe(
//       catchError((error) => {
//         console.error(`Error updating debt with id ${debt.debtId}:`, error)
//         return of(null)
//       }),
//     )
//   }

//   deleteDebt(id: number): Observable<boolean> {
//     return this.http.delete(`${this.apiUrl}/${id}`).pipe(
//       map(() => true),
//       catchError((error) => {
//         console.error(`Error deleting debt with id ${id}:`, error)
//         return of(false)
//       }),
//     )
//   }

//   deductFromDebt(id: number, amount: number): Observable<boolean> {
//     return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {}).pipe(
//       map(() => true),
//       catchError((error) => {
//         console.error(`Error deducting ${amount} from debt with id ${id}:`, error)
//         return of(false)
//       }),
//     )
//   }

//   getTotalDebtsCount(): Observable<number> {
//     return this.http.get<number>(`${this.apiUrl}/count`).pipe(
//       map((response) => (typeof response === "number" ? response : 0)),
//       catchError((error) => {
//         console.error("Error fetching total debts count:", error)
//         return of(0)
//       }),
//     )
//   }

//   getTotalOutstandingAmount(): Observable<number> {
//     return this.http.get<number>(`${this.apiUrl}/totalOutstanding`).pipe(
//       map((response) => (typeof response === "number" ? response : 0)),
//       catchError((error) => {
//         console.error("Error fetching total outstanding amount:", error)
//         return of(0)
//       }),
//     )
//   }

//   getTotalDeductionsMade(): Observable<number> {
//     return this.http.get<number>(`${this.apiUrl}/totalDeductions`).pipe(
//       map((response) => (typeof response === "number" ? response : 0)),
//       catchError((error) => {
//         console.error("Error fetching total deductions made:", error)
//         return of(0)
//       }),
//     )
//   }
// }

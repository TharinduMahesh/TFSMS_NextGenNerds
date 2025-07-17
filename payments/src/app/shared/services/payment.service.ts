

// import { Injectable } from "@angular/core"
// import  { HttpClient } from "@angular/common/http"
// import {  Observable, throwError, of } from "rxjs"
// import { map, catchError } from "rxjs/operators"
// import  { Payment } from "../../models/payment.model"
// import  { PaymentCalculationRequest, PaymentCalculationResult } from "../../models/payment-calculation.model"
// import { environment } from "../../shared/environments/environment"
// import  { SupplierTotalPaymentRecord } from "../../models/supplier-total-payment.model"
// import  { PaymentHistory } from "../../models/payment-history.model"

// @Injectable({
//   providedIn: "root",
// })
// export class PaymentService {
//   private apiUrl = `${environment.apiBaseUrl}/api/Payments`

//   constructor(private http: HttpClient) {}

//   getPayments(): Observable<Payment[]> {
//     console.log("Fetching payments from:", this.apiUrl)
//     return this.http.get<any>(this.apiUrl).pipe(
//       map((response) => {
//         console.log("Raw API response:", response)
//         // Handle the response based on its structure
//         if (Array.isArray(response)) {
//           console.log("Response is an array with length:", response.length)
//           return response
//         } else if (response && typeof response === "object") {
//           // Handle .NET Core JSON serialization format
//           if (Array.isArray(response.$values)) {
//             console.log("Response has $values array with length:", response.$values.length)
//             return response.$values
//           }
//           // If the response is an object, extract the data
//           if (Array.isArray(response.data)) {
//             console.log("Response has data array with length:", response.data.length)
//             return response.data
//           } else if (response.data) {
//             console.log("Response has data object, converting to array")
//             return [response.data]
//           } else {
//             // Check if the response itself might be a single payment object
//             if (response.PaymentId !== undefined || response.paymentId !== undefined) {
//               console.log("Response appears to be a single payment object, converting to array")
//               return [response]
//             }
//             // Last resort: try to extract any array-like property from the response
//             const possibleArrayProps = Object.keys(response).filter(
//               (key) =>
//                 Array.isArray(response[key]) &&
//                 response[key].length > 0 &&
//                 (response[key][0].PaymentId !== undefined || response[key][0].paymentId !== undefined),
//             )
//             if (possibleArrayProps.length > 0) {
//               console.log(`Found possible payments array in property: ${possibleArrayProps[0]}`)
//               return response[possibleArrayProps[0]]
//             }
//             console.log("Could not find payments data in response, returning empty array")
//             return []
//           }
//         }
//         console.log("Response format not recognized, returning empty array")
//         return []
//       }),
//       catchError((error) => {
//         console.error("Error fetching payments:", error)
//         // Return empty array instead of throwing error to prevent app crash
//         return of([])
//       }),
//     )
//   }

//   getPayment(id: number): Observable<Payment | null> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error(`Error fetching payment ${id}:`, error)
//         return of(null)
//       }),
//     )
//   }

//   getPaymentsBySupplier(SupplierId: number): Observable<Payment[]> {
//     return this.http.get<any>(`${this.apiUrl}/supplier/${SupplierId}`).pipe(
//       map((response) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response && typeof response === "object") {
//           // Handle .NET Core JSON serialization format
//           if (Array.isArray(response.$values)) {
//             return response.$values
//           }
//           // Handle wrapped response
//           if (Array.isArray(response.data)) {
//             return response.data
//           }
//           // Single object response
//           return [response]
//         }
//         return []
//       }),
//       catchError((error) => {
//         console.error(`Error fetching payments for supplier ${SupplierId}:`, error)
//         return of([])
//       }),
//     )
//   }

//   getPaymentsByDateRange(startDate: string, endDate: string): Observable<Payment[]> {
//     const encodedStartDate = encodeURIComponent(startDate)
//     const encodedEndDate = encodeURIComponent(endDate)
//     return this.http.get<any>(`${this.apiUrl}/date-range?startDate=${encodedStartDate}&endDate=${encodedEndDate}`).pipe(
//       map((response) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response && typeof response === "object") {
//           // Handle .NET Core JSON serialization format
//           if (Array.isArray(response.$values)) {
//             return response.$values
//           }
//           // Handle wrapped response
//           if (Array.isArray(response.data)) {
//             return response.data
//           }
//           // Single object response
//           return [response]
//         }
//         return []
//       }),
//       catchError((error) => {
//         console.error("Error fetching payments by date range:", error)
//         return of([])
//       }),
//     )
//   }

//   getPaymentsByMethod(method: string): Observable<Payment[]> {
//     return this.http.get<any>(`${this.apiUrl}/method/${encodeURIComponent(method)}`).pipe(
//       map((response) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response && typeof response === "object") {
//           if (Array.isArray(response.$values)) {
//             return response.$values
//           }
//           if (Array.isArray(response.data)) {
//             return response.data
//           }
//           return [response]
//         }
//         return []
//       }),
//       catchError((error) => {
//         console.error(`Error fetching payments by method ${method}:`, error)
//         return of([])
//       }),
//     )
//   }

//   calculatePayment(request: PaymentCalculationRequest): Observable<PaymentCalculationResult | null> {
//     return this.http.post<any>(`${this.apiUrl}/calculate`, request).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error("Error calculating payment:", error)
//         return of(null)
//       }),
//     )
//   }

//   createPayment(payment: Payment): Observable<Payment | null> {
//     return this.http.post<any>(this.apiUrl, payment).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error("Error creating payment:", error)
//         return of(null)
//       }),
//     )
//   }

//   updatePayment(payment: Payment): Observable<Payment | null> {
//     return this.http.put<any>(`${this.apiUrl}/${payment.PaymentId}`, payment).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error(`Error updating payment ${payment.PaymentId}:`, error)
//         return of(null)
//       }),
//     )
//   }

//   deletePayment(id: number): Observable<boolean> {
//     return this.http.delete(`${this.apiUrl}/${id}`).pipe(
//       map(() => true),
//       catchError((error) => {
//         console.error(`Error deleting payment ${id}:`, error)
//         return of(false)
//       }),
//     )
//   }

//   getTotalPaymentsCount(): Observable<number> {
//     return this.http.get<any>(`${this.apiUrl}/count`).pipe(
//       map((response) => {
//         // Handle different response formats for numeric values
//         if (typeof response === "number") {
//           return response
//         } else if (response && typeof response === "object") {
//           if (typeof response.data === "number") {
//             return response.data
//           } else if (typeof response.count === "number") {
//             return response.count
//           } else if (typeof response.total === "number") {
//             return response.total
//           }
//         }
//         return 0
//       }),
//       catchError((error) => {
//         console.error("Error fetching payments count:", error)
//         return of(0)
//       }),
//     )
//   }

//   getTotalPaymentsAmount(): Observable<number> {
//     return this.http.get<any>(`${this.apiUrl}/totalAmount`).pipe(
//       map((response) => {
//         if (typeof response === "number") {
//           return response
//         } else if (response && typeof response === "object") {
//           if (typeof response.data === "number") {
//             return response.data
//           } else if (typeof response.total === "number") {
//             return response.total
//           } else if (typeof response.amount === "number") {
//             return response.amount
//           }
//         }
//         return 0
//       }),
//       catchError((error) => {
//         console.error("Error fetching total payments amount:", error)
//         return of(0)
//       }),
//     )
//   }

//   getTotalPaymentsByMethod(method: string): Observable<number> {
//     return this.http.get<any>(`${this.apiUrl}/totalByMethod/${encodeURIComponent(method)}`).pipe(
//       map((response) => {
//         if (typeof response === "number") {
//           return response
//         } else if (response && typeof response === "object") {
//           if (typeof response.data === "number") {
//             return response.data
//           } else if (typeof response.total === "number") {
//             return response.total
//           } else if (typeof response.amount === "number") {
//             return response.amount
//           }
//         }
//         return 0
//       }),
//       catchError((error) => {
//         console.error(`Error fetching total payments for method ${method}:`, error)
//         return of(0)
//       }),
//     )
//   }

//   getPaymentSummary(startDate?: string, endDate?: string): Observable<any> {
//     let url = `${this.apiUrl}/summary`
//     const params: string[] = []
//     if (startDate) {
//       params.push(`startDate=${encodeURIComponent(startDate)}`)
//     }
//     if (endDate) {
//       params.push(`endDate=${encodeURIComponent(endDate)}`)
//     }
//     if (params.length > 0) {
//       url += `?${params.join("&")}`
//     }
//     return this.http.get<any>(url).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response || {}
//       }),
//       catchError((error) => {
//         console.error("Error fetching payment summary:", error)
//         return of({})
//       }),
//     )
//   }

//   exportPayments(format: string, startDate?: string, endDate?: string): Observable<Blob> {
//     let url = `${this.apiUrl}/export?format=${encodeURIComponent(format)}`
//     if (startDate && endDate) {
//       url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
//     }
//     return this.http.get(url, { responseType: "blob" }).pipe(
//       catchError((error) => {
//         console.error("Error exporting payments:", error)
//         return throwError(() => new Error("Failed to export payments"))
//       }),
//     )
//   }

//   validatePayment(payment: Payment): Observable<{ isValid: boolean; errors: string[] }> {
//     return this.http.post<any>(`${this.apiUrl}/validate`, payment).pipe(
//       map((response) => {
//         if (response && response.data) {
//           return response.data
//         }
//         return response || { isValid: false, errors: ["Unknown validation error"] }
//       }),
//       catchError((error) => {
//         console.error("Error validating payment:", error)
//         return of({ isValid: false, errors: ["Validation service unavailable"] })
//       }),
//     )
//   }

//   // Method to get total payments by supplier
//   getSupplierTotalPayments(): Observable<SupplierTotalPaymentRecord[]> {
//     return this.http.get<SupplierTotalPaymentRecord[]>(`${this.apiUrl}/supplier-totals`).pipe(
//       catchError((error) => {
//         console.error("Error fetching supplier total payments:", error)
//         return of([]) // Return an empty array on error
//       }),
//     )
//   }

//   // Method to get all payment history records
//   getPaymentHistory(): Observable<PaymentHistory[]> {
//     return this.http.get<PaymentHistory[]>(`${this.apiUrl}/history`).pipe(
//       catchError((error) => {
//         console.error("Error fetching payment history:", error)
//         return of([]) // Return an empty array on error
//       }),
//     )
//   }

//   // Method to get history for a specific payment (if needed, currently commented out in your provided code)
//   getPaymentHistoryById(paymentId: number): Observable<any[]> {
//     return this.http.get<any>(`${this.apiUrl}/${paymentId}/history`).pipe(
//       map((response) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response && Array.isArray(response.$values)) {
//           return response.$values
//         } else if (response && Array.isArray(response.data)) {
//           return response.data
//         }
//         return []
//       }),
//       catchError((error) => {
//         console.error(`Error fetching payment history for ${paymentId}:`, error)
//         return of([])
//       }),
//     )
//   }
// }


import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, throwError, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import  { Payment } from "../../models/payment.model"
import  { PaymentCalculationRequest, PaymentCalculationResult } from "../../models/payment-calculation.model"
import { environment } from "../../shared/environments/environment"
import  { SupplierTotalPaymentRecord } from "../../models/supplier-total-payment.model"
import  { PaymentHistory } from "../../models/payment-history.model" // Ensure this is imported

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private apiUrl = `${environment.apiBaseUrl}/api/Payments`

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    console.log("Fetching payments from:", this.apiUrl)
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        console.log("Raw API response:", response)
        // Handle the response based on its structure
        if (Array.isArray(response)) {
          console.log("Response is an array with length:", response.length)
          return response
        } else if (response && typeof response === "object") {
          // Handle .NET Core JSON serialization format
          if (Array.isArray(response.$values)) {
            console.log("Response has $values array with length:", response.$values.length)
            return response.$values
          }
          // If the response is an object, extract the data
          if (Array.isArray(response.data)) {
            console.log("Response has data array with length:", response.data.length)
            return response.data
          } else if (response.data) {
            console.log("Response has data object, converting to array")
            return [response.data]
          } else {
            // Check if the response itself might be a single payment object
            if (response.PaymentId !== undefined || response.paymentId !== undefined) {
              console.log("Response appears to be a single payment object, converting to array")
              return [response]
            }
            // Last resort: try to extract any array-like property from the response
            const possibleArrayProps = Object.keys(response).filter(
              (key) =>
                Array.isArray(response[key]) &&
                response[key].length > 0 &&
                (response[key][0].PaymentId !== undefined || response[key][0].paymentId !== undefined),
            )
            if (possibleArrayProps.length > 0) {
              console.log(`Found possible payments array in property: ${possibleArrayProps[0]}`)
              return response[possibleArrayProps[0]]
            }
            console.log("Could not find payments data in response, returning empty array")
            return []
          }
        }
        console.log("Response format not recognized, returning empty array")
        return []
      }),
      catchError((error) => {
        console.error("Error fetching payments:", error)
        // Return empty array instead of throwing error to prevent app crash
        return of([])
      }),
    )
  }

  getPayment(id: number): Observable<Payment | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error(`Error fetching payment ${id}:`, error)
        return of(null)
      }),
    )
  }

  getPaymentsBySupplier(SupplierId: number): Observable<Payment[]> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${SupplierId}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && typeof response === "object") {
          // Handle .NET Core JSON serialization format
          if (Array.isArray(response.$values)) {
            return response.$values
          }
          // Handle wrapped response
          if (Array.isArray(response.data)) {
            return response.data
          }
          // Single object response
          return [response]
        }
        return []
      }),
      catchError((error) => {
        console.error(`Error fetching payments for supplier ${SupplierId}:`, error)
        return of([])
      }),
    )
  }

  getPaymentsByDateRange(startDate: string, endDate: string): Observable<Payment[]> {
    const encodedStartDate = encodeURIComponent(startDate)
    const encodedEndDate = encodeURIComponent(endDate)
    return this.http.get<any>(`${this.apiUrl}/date-range?startDate=${encodedStartDate}&endDate=${encodedEndDate}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && typeof response === "object") {
          // Handle .NET Core JSON serialization format
          if (Array.isArray(response.$values)) {
            return response.$values
          }
          // Handle wrapped response
          if (Array.isArray(response.data)) {
            return response.data
          }
          // Single object response
          return [response]
        }
        return []
      }),
      catchError((error) => {
        console.error("Error fetching payments by date range:", error)
        return of([])
      }),
    )
  }

  getPaymentsByMethod(method: string): Observable<Payment[]> {
    return this.http.get<any>(`${this.apiUrl}/method/${encodeURIComponent(method)}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && typeof response === "object") {
          if (Array.isArray(response.$values)) {
            return response.$values
          }
          if (Array.isArray(response.data)) {
            return response.data
          }
          return [response]
        }
        return []
      }),
      catchError((error) => {
        console.error(`Error fetching payments by method ${method}:`, error)
        return of([])
      }),
    )
  }

  calculatePayment(request: PaymentCalculationRequest): Observable<PaymentCalculationResult | null> {
    return this.http.post<any>(`${this.apiUrl}/calculate`, request).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error("Error calculating payment:", error)
        return of(null)
      }),
    )
  }

  createPayment(payment: Payment): Observable<Payment | null> {
    return this.http.post<any>(this.apiUrl, payment).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error("Error creating payment:", error)
        return of(null)
      }),
    )
  }

  updatePayment(payment: Payment): Observable<Payment | null> {
    return this.http.put<any>(`${this.apiUrl}/${payment.PaymentId}`, payment).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error(`Error updating payment ${payment.PaymentId}:`, error)
        return of(null)
      }),
    )
  }

  deletePayment(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error deleting payment ${id}:`, error)
        return of(false)
      }),
    )
  }

  getTotalPaymentsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/count`).pipe(
      map((response) => {
        // Handle different response formats for numeric values
        if (typeof response === "number") {
          return response
        } else if (response && typeof response === "object") {
          if (typeof response.data === "number") {
            return response.data
          } else if (typeof response.count === "number") {
            return response.count
          } else if (typeof response.total === "number") {
            return response.total
          }
        }
        return 0
      }),
      catchError((error) => {
        console.error("Error fetching payments count:", error)
        return of(0)
      }),
    )
  }

  getTotalPaymentsAmount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/totalAmount`).pipe(
      map((response) => {
        if (typeof response === "number") {
          return response
        } else if (response && typeof response === "object") {
          if (typeof response.data === "number") {
            return response.data
          } else if (typeof response.total === "number") {
            return response.total
          } else if (typeof response.amount === "number") {
            return response.amount
          }
        }
        return 0
      }),
      catchError((error) => {
        console.error("Error fetching total payments amount:", error)
        return of(0)
      }),
    )
  }

  getTotalPaymentsByMethod(method: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/totalByMethod/${encodeURIComponent(method)}`).pipe(
      map((response) => {
        if (typeof response === "number") {
          return response
        } else if (response && typeof response === "object") {
          if (typeof response.data === "number") {
            return response.data
          } else if (typeof response.total === "number") {
            return response.total
          } else if (typeof response.amount === "number") {
            return response.amount
          }
        }
        return 0
      }),
      catchError((error) => {
        console.error(`Error fetching total payments for method ${method}:`, error)
        return of(0)
      }),
    )
  }

  getPaymentSummary(startDate?: string, endDate?: string): Observable<any> {
    let url = `${this.apiUrl}/summary`
    const params: string[] = []
    if (startDate) {
      params.push(`startDate=${encodeURIComponent(startDate)}`)
    }
    if (endDate) {
      params.push(`endDate=${encodeURIComponent(endDate)}`)
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`
    }
    return this.http.get<any>(url).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response || {}
      }),
      catchError((error) => {
        console.error("Error fetching payment summary:", error)
        return of({})
      }),
    )
  }

  exportPayments(format: string, startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/export?format=${encodeURIComponent(format)}`
    if (startDate && endDate) {
      url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    }
    return this.http.get(url, { responseType: "blob" }).pipe(
      catchError((error) => {
        console.error("Error exporting payments:", error)
        return throwError(() => new Error("Failed to export payments"))
      }),
    )
  }

  validatePayment(payment: Payment): Observable<{ isValid: boolean; errors: string[] }> {
    return this.http.post<any>(`${this.apiUrl}/validate`, payment).pipe(
      map((response) => {
        if (response && response.data) {
          return response.data
        }
        return response || { isValid: false, errors: ["Unknown validation error"] }
      }),
      catchError((error) => {
        console.error("Error validating payment:", error)
        return of({ isValid: false, errors: ["Validation service unavailable"] })
      }),
    )
  }

  // Method to get total payments by supplier
  getSupplierTotalPayments(): Observable<SupplierTotalPaymentRecord[]> {
    return this.http.get<SupplierTotalPaymentRecord[]>(`${this.apiUrl}/supplier-totals`).pipe(
      catchError((error) => {
        console.error("Error fetching supplier total payments:", error)
        return of([]) // Return an empty array on error
      }),
    )
  }

  // Method to get all payment history records
  // getPaymentHistory(): Observable<PaymentHistory[]> {
  //   return this.http.get<PaymentHistory[]>(`${this.apiUrl}/history`).pipe(
  //     map((response) => {
  //       // Handle .NET Core JSON serialization format for arrays
  //       if (Array.isArray(response)) {
  //         return response
  //       } else if (response && Array.isArray(response.$values)) {
  //         return response.$values
  //       }
  //       return []
  //     }),
  //     catchError((error) => {
  //       console.error("Error fetching payment history:", error)
  //       return of([]) // Return an empty array on error
  //     }),
  //   )
  // }

  //  Method to get all payment history records
  getPaymentHistory(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.apiUrl}/history`).pipe(
      catchError((error) => {
        console.error("Error fetching payment history:", error)
        return of([]) // Return an empty array on error
      }),
    )
  }

  // Method to get history for a specific payment (if needed, currently commented out in your provided code)
  getPaymentHistoryById(paymentId: number): Observable<PaymentHistory[]> {
    return this.http.get<any>(`${this.apiUrl}/${paymentId}/history`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && Array.isArray(response.$values)) {
          return response.$values
        } else if (response && Array.isArray(response.data)) {
          return response.data
        }
        return []
      }),
      catchError((error) => {
        console.error(`Error fetching payment history for ${paymentId}:`, error)
        return of([])
      }),
    )
  }
}

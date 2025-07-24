// import { Injectable } from "@angular/core"
// import  { HttpClient } from "@angular/common/http"
// import {  Observable, catchError, map, of } from "rxjs"
// import  { Advance } from "../../models/advance.model"
// import { environment } from "../../shared/environments/environment"

// @Injectable({
//   providedIn: "root",
// })
// export class AdvanceService {
//   private apiUrl = `${environment.apiBaseUrl}/api/Advances`

//   constructor(private http: HttpClient) {}

//   getAllAdvances(): Observable<Advance[]> {
//     console.log("Fetching advances from:", this.apiUrl)
//     return this.http.get<any>(this.apiUrl).pipe(
//       map((response) => {
//         console.log("Raw API response for advances:", response)
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
//             // Check if the response itself might be a single advance object
//             if (response.AdvanceId !== undefined || response.advanceId !== undefined) {
//               console.log("Response appears to be a single advance object, converting to array")
//               return [response]
//             }
//             // Last resort: try to extract any array-like property from the response
//             const possibleArrayProps = Object.keys(response).filter(
//               (key) =>
//                 Array.isArray(response[key]) &&
//                 response[key].length > 0 &&
//                 (response[key][0].AdvanceId !== undefined || response[key][0].advanceId !== undefined),
//             )
//             if (possibleArrayProps.length > 0) {
//               console.log(`Found possible advances array in property: ${possibleArrayProps[0]}`)
//               return response[possibleArrayProps[0]]
//             }
//             console.log("Could not find advances data in response, returning empty array")
//             return []
//           }
//         }
//         console.log("Response format not recognized, returning empty array")
//         return []
//       }),
//       catchError((error) => {
//         console.error("Error fetching all advances:", error)
//         return of([])
//       }),
//     )
//   }

//   getAdvance(id: number): Observable<Advance | null> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error(`Error fetching advance with id ${id}:`, error)
//         return of(null)
//       }),
//     )
//   }

//   getAdvancesBySupplier(SupplierId: number): Observable<Advance[]> {
//     return this.http.get<any>(`${this.apiUrl}/supplier/${SupplierId}`).pipe(
//       map((response) => {
//         if (Array.isArray(response)) {
//           return response
//         } else if (response && Array.isArray(response.$values)) {
//           return response.$values
//         } else if (response && Array.isArray(response.data)) {
//           return response.data
//         } else if (response && typeof response === "object") {
//           return [response]
//         }
//         return []
//       }),
//       catchError((error) => {
//         console.error(`Error fetching advances for supplier ${SupplierId}:`, error)
//         return of([])
//       }),
//     )
//   }

//   createAdvance(advance: Advance): Observable<Advance | null> {
//     return this.http.post<any>(this.apiUrl, advance).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error("Error creating advance:", error)
//         return of(null)
//       }),
//     )
//   }

//   updateAdvance(advance: Advance): Observable<Advance | null> {
//     return this.http.put<any>(`${this.apiUrl}/${advance.AdvanceId}`, advance).pipe(
//       map((response) => {
//         // Handle wrapped response
//         if (response && response.data) {
//           return response.data
//         }
//         return response
//       }),
//       catchError((error) => {
//         console.error(`Error updating advance with id ${advance.AdvanceId}:`, error)
//         return of(null)
//       }),
//     )
//   }

//   deleteAdvance(id: number): Observable<boolean> {
//     return this.http.delete(`${this.apiUrl}/${id}`).pipe(
//       map(() => true),
//       catchError((error) => {
//         console.error(`Error deleting advance with id ${id}:`, error)
//         return of(false)
//       }),
//     )
//   }

//   deductFromAdvance(id: number, amount: number): Observable<boolean> {
//     return this.http.put(`${this.apiUrl}/${id}/deduct/${amount}`, {}).pipe(
//       map(() => true),
//       catchError((error) => {
//         console.error(`Error deducting ${amount} from advance with id ${id}:`, error)
//         return of(false)
//       }),
//     )
//   }

//   getTotalAdvancesCount(): Observable<number> {
//     return this.http.get<any>(`${this.apiUrl}/count`).pipe(
//       map((response) => {
//         if (typeof response === "number") {
//           return response
//         } else if (response && typeof response.data === "number") {
//           return response.data
//         } else if (response && typeof response.count === "number") {
//           return response.count
//         }
//         return 0
//       }),
//       catchError((error) => {
//         console.error("Error fetching total advances count:", error)
//         return of(0)
//       }),
//     )
//   }

//   getTotalOutstandingAmount(): Observable<number> {
//     return this.http.get<any>(`${this.apiUrl}/totalOutstanding`).pipe(
//       map((response) => {
//         if (typeof response === "number") {
//           return response
//         } else if (response && typeof response.data === "number") {
//           return response.data
//         } else if (response && typeof response.total === "number") {
//           return response.total
//         }
//         return 0
//       }),
//       catchError((error) => {
//         console.error("Error fetching total outstanding amount:", error)
//         return of(0)
//       }),
//     )
//   }

//   getTotalRecoveredAmount(): Observable<number> {
//     return this.http.get<any>(`${this.apiUrl}/totalRecovered`).pipe(
//       map((response) => {
//         if (typeof response === "number") {
//           return response
//         } else if (response && typeof response.data === "number") {
//           return response.data
//         } else if (response && typeof response.total === "number") {
//           return response.total
//         }
//         return 0
//       }),
//       catchError((error) => {
//         console.error("Error fetching total recovered amount:", error)
//         return of(0)
//       }),
//     )
//   }
// }

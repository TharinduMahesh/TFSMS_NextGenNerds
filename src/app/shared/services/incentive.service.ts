import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, catchError, map, of } from "rxjs"
import  { Incentive } from "../../models/incentive.model"
import { environment } from "../../shared/environments/environment"

@Injectable({
  providedIn: "root",
})
export class IncentiveService {
  private apiUrl = `${environment.apiBaseUrl}/api/incentives`

  constructor(private http: HttpClient) {}

  getAllIncentives(): Observable<Incentive[]> {
    console.log("Fetching incentives from:", this.apiUrl)
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        console.log("Raw API response for incentives:", response)
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
            // Check if the response itself might be a single incentive object
            if (response.IncentiveId !== undefined || response.incentiveId !== undefined) {
              console.log("Response appears to be a single incentive object, converting to array")
              return [response]
            }
            // Last resort: try to extract any array-like property from the response
            const possibleArrayProps = Object.keys(response).filter(
              (key) =>
                Array.isArray(response[key]) &&
                response[key].length > 0 &&
                (response[key][0].IncentiveId !== undefined || response[key][0].incentiveId !== undefined),
            )
            if (possibleArrayProps.length > 0) {
              console.log(`Found possible incentives array in property: ${possibleArrayProps[0]}`)
              return response[possibleArrayProps[0]]
            }
            console.log("Could not find incentives data in response, returning empty array")
            return []
          }
        }
        console.log("Response format not recognized, returning empty array")
        return []
      }),
      catchError((error) => {
        console.error("Error fetching all incentives:", error)
        return of([])
      }),
    )
  }

  getIncentive(id: number): Observable<Incentive | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error(`Error fetching incentive with id ${id}:`, error)
        return of(null)
      }),
    )
  }

  getIncentivesBySupplier(supplierId: number): Observable<Incentive[]> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${supplierId}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && Array.isArray(response.$values)) {
          return response.$values
        } else if (response && Array.isArray(response.data)) {
          return response.data
        } else if (response && typeof response === "object") {
          return [response]
        }
        return []
      }),
      catchError((error) => {
        console.error(`Error fetching incentives for supplier ${supplierId}:`, error)
        return of([])
      }),
    )
  }

  getCurrentIncentiveForSupplier(supplierId: number): Observable<Incentive | null> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${supplierId}/current`).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error(`Error fetching current incentive for supplier ${supplierId}:`, error)
        return of(null)
      }),
    )
  }

  createIncentive(incentive: Incentive): Observable<Incentive | null> {
    return this.http.post<any>(this.apiUrl, incentive).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error("Error creating incentive:", error)
        return of(null)
      }),
    )
  }

  updateIncentive(incentive: Incentive): Observable<Incentive | null> {
    return this.http.put<any>(`${this.apiUrl}/${incentive.IncentiveId}`, incentive).pipe(
      map((response) => {
        // Handle wrapped response
        if (response && response.data) {
          return response.data
        }
        return response
      }),
      catchError((error) => {
        console.error(`Error updating incentive with id ${incentive.IncentiveId}:`, error)
        return of(null)
      }),
    )
  }

  // In incentive.service.ts

deleteIncentive(id: number): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => ({ success: true })), // If DELETE succeeds, return a success object.
      catchError((error) => {
        // Capture the specific error message from the backend's response body.
        const errorMessage = error.error?.message || `Failed to delete incentive. The server returned an error.`;
        console.error(errorMessage, error);
        // Return an observable of a failure object with the detailed message.
        return of({ success: false, message: errorMessage });
      })
    );
  }

  getTotalIncentivesCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/count`).pipe(
      map((response) => {
        if (typeof response === "number") {
          return response
        } else if (response && typeof response.data === "number") {
          return response.data
        } else if (response && typeof response.count === "number") {
          return response.count
        }
        return 0
      }),
      catchError((error) => {
        console.error("Error fetching total incentives count:", error)
        return of(0)
      }),
    )
  }

  getTotalQualityBonusAmount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/totalQualityBonus`).pipe(
      map((response) => {
        if (typeof response === "number") {
          return response
        } else if (response && typeof response.data === "number") {
          return response.data
        } else if (response && typeof response.total === "number") {
          return response.total
        }
        return 0
      }),
      catchError((error) => {
        console.error("Error fetching total quality bonus amount:", error)
        return of(0)
      }),
    )
  }

  getTotalLoyaltyBonusAmount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/totalLoyaltyBonus`).pipe(
      map((response) => {
        if (typeof response === "number") {
          return response
        } else if (response && typeof response.data === "number") {
          return response.data
        } else if (response && typeof response.total === "number") {
          return response.total
        }
        return 0
      }),
      catchError((error) => {
        console.error("Error fetching total loyalty bonus amount:", error)
        return of(0)
      }),
    )
  }

  getCurrentIncentiveAmount(supplierId: number): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${supplierId}/current-amount`).pipe(
      map((response) => {
        if (typeof response === "number") {
          return response
        } else if (response && typeof response.data === "number") {
          return response.data
        } else if (response && typeof response.amount === "number") {
          return response.amount
        }
        return 0
      }),
      catchError((error) => {
        console.error(`Error fetching current incentive amount for supplier ${supplierId}:`, error)
        return of(0)
      }),
    )
  }

  /**
   * Gets the latest incentive record for a supplier
   */
  getLatestIncentive(supplierId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${supplierId}/latest`).pipe(
      map((response) => {
        if (response && typeof response === "object") {
          return response
        }
        return { TotalAmount: 0, Month: "", QualityBonus: 0, LoyaltyBonus: 0 }
      }),
      catchError((error) => {
        console.error(`Error fetching latest incentive for supplier ${supplierId}:`, error)
        return of({ TotalAmount: 0, Month: "", QualityBonus: 0, LoyaltyBonus: 0 })
      }),
    )
  }

  /**
   * Updates incentive usage when a payment is made
   */
  updateIncentiveUsage(supplierId: number, usedAmount: number): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/supplier/${supplierId}/update-usage`, { UsedAmount: usedAmount }).pipe(
      map((response) => {
        return response === true || (response && response.success === true)
      }),
      catchError((error) => {
        console.error(`Error updating incentive usage for supplier ${supplierId}:`, error)
        return of(false)
      }),
    )
  }
}

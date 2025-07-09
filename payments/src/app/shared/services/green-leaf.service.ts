

import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, catchError, map, of } from "rxjs"
import  { GreenLeaf } from "../../models/green-leaf.model"
import { environment } from "../../shared/environments/environment"

@Injectable({
  providedIn: "root",
})
export class GreenLeafService {
  private apiUrl = `${environment.apiBaseUrl}/api/greenleaf`

  constructor(private http: HttpClient) {}

  getGreenLeafData(): Observable<GreenLeaf[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        // Handle different response formats
        if (Array.isArray(response)) {
          return response
        } else if (response && response.data && Array.isArray(response.data)) {
          return response.data
        } else if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values
        }
        return []
      }),
      catchError((error) => {
        console.error("Error fetching green leaf data:", error)
        return of([])
      }),
    )
  }

  getGreenLeafDataBySupplier(SupplierId: number): Observable<GreenLeaf[]> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${SupplierId}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && response.data && Array.isArray(response.data)) {
          return response.data
        } else if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values
        }
        return []
      }),
      catchError((error) => {
        console.error(`Error fetching green leaf data for supplier ${SupplierId}:`, error)
        return of([])
      }),
    )
  }

  getLatestGreenLeafWeight(SupplierId: number): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${SupplierId}/latest-weight`).pipe(
      map((response) => {
        // Handle different response formats for numeric values
        if (typeof response === "number") {
          return response
        } else if (response && typeof response.data === "number") {
          return response.data
        } else if (response && typeof response.weight === "number") {
          return response.weight
        } else if (response && typeof response.value === "number") {
          return response.value
        }
        return 0
      }),
      catchError((error) => {
        console.error(`Error fetching latest green leaf weight for supplier ${SupplierId}:`, error)
        return of(0)
      }),
    )
  }

  getTotalGreenLeafBySupplier(SupplierId: number, startDate: string, endDate: string): Observable<number> {
    return this.http
      .get<any>(`${this.apiUrl}/supplier/${SupplierId}/total?startDate=${startDate}&endDate=${endDate}`)
      .pipe(
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
          console.error(`Error fetching total green leaf for supplier ${SupplierId}:`, error)
          return of(0)
        }),
      )
  }

  getGreenLeafSummary(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary?startDate=${startDate}&endDate=${endDate}`).pipe(
      map((response) => {
        // Return the response as-is, but ensure it's an object
        if (response && typeof response === "object") {
          return response
        }
        return {}
      }),
      catchError((error) => {
        console.error("Error fetching green leaf summary:", error)
        return of({})
      }),
    )
  }
}

import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { catchError } from "rxjs/operators"
import { environment } from "../../shared/environments/environment"
import  { SupplierTotalPaymentRecord } from "../../models/supplier-total-payment.model"
@Injectable({
  providedIn: "root",
})
export class SupplierTotalPaymentRecordService {
  private apiUrl = `${environment.apiBaseUrl}/api/SupplierTotalPaymentRecords`

  constructor(private http: HttpClient) {}

  getSupplierTotalPaymentRecords(): Observable<SupplierTotalPaymentRecord[]> {
    return this.http.get<SupplierTotalPaymentRecord[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error("Error fetching supplier total payment records:", error)
        return of([])
      }),
    )
  }

  getSupplierTotalPaymentRecordById(id: number): Observable<SupplierTotalPaymentRecord | null> {
    return this.http.get<SupplierTotalPaymentRecord>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching supplier total payment record ${id}:`, error)
        return of(null)
      }),
    )
  }

  createSupplierTotalPaymentRecord(record: SupplierTotalPaymentRecord): Observable<SupplierTotalPaymentRecord | null> {
    return this.http.post<SupplierTotalPaymentRecord>(this.apiUrl, record).pipe(
      catchError((error) => {
        console.error("Error creating supplier total payment record:", error)
        return of(null)
      }),
    )
  }

  updateSupplierTotalPaymentRecord(record: SupplierTotalPaymentRecord): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${record.id}`, record).pipe(
      catchError((error) => {
        console.error(`Error updating supplier total payment record ${record.id}:`, error)
        return of(undefined) // Return undefined on error for void observable
      }),
    )
  }

  deleteSupplierTotalPaymentRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting supplier total payment record ${id}:`, error)
        return of(undefined)
      }),
    )
  }
}

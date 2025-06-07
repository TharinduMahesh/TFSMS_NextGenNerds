import { Injectable } from "@angular/core"
import  { HttpClient, HttpErrorResponse } from "@angular/common/http"
import {  Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import  { DenaturedTea } from "../../models/denatured-tea.model"
import { Invoice } from "../../models/invoice.model"

@Injectable({
  providedIn: "root",
})
export class DenaturedTeaService {
  private apiUrl = "http://localhost:3000/api" // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getDenaturedTeas(): Observable<DenaturedTea[]> {
    return this.http.get<DenaturedTea[]>(`${this.apiUrl}/denatured-teas`).pipe(catchError(this.handleError))
  }

  getInvoices(): Observable<Invoice[]> {
      return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).pipe(catchError(this.handleError))
    }
  createDenaturedTea(denaturedTea: Omit<DenaturedTea, "id">): Observable<DenaturedTea> {
    return this.http
      .post<DenaturedTea>(`${this.apiUrl}/denatured-teas`, denaturedTea)
      .pipe(catchError(this.handleError))
  }

  updateDenaturedTea(id: number, denaturedTea: Partial<DenaturedTea>): Observable<DenaturedTea> {
    return this.http
      .put<DenaturedTea>(`${this.apiUrl}/denatured-teas/${id}`, denaturedTea)
      .pipe(catchError(this.handleError))
  }

  deleteDenaturedTea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/denatured-teas/${id}`).pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!"
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    console.error(errorMessage)
    return throwError(() => errorMessage)
  }
}

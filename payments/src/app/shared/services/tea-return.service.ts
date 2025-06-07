import { Injectable } from "@angular/core"
import  { HttpClient, HttpErrorResponse } from "@angular/common/http"
import {  Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import  { TeaReturn } from "../../models/tea-return.model"
import { Invoice } from "../../models/invoice.model"

@Injectable({
  providedIn: "root",
})
export class TeaReturnService {
  private apiUrl = "http://localhost:3000/api" // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getTeaReturns(): Observable<TeaReturn[]> {
    return this.http.get<TeaReturn[]>(`${this.apiUrl}/tea-returns`).pipe(catchError(this.handleError))
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`).pipe(catchError(this.handleError))
  }

  createTeaReturn(teaReturn: Omit<TeaReturn, "id">): Observable<TeaReturn> {
    return this.http.post<TeaReturn>(`${this.apiUrl}/tea-returns`, teaReturn).pipe(catchError(this.handleError))
  }

  updateTeaReturn(id: number, teaReturn: Partial<TeaReturn>): Observable<TeaReturn> {
    return this.http.put<TeaReturn>(`${this.apiUrl}/tea-returns/${id}`, teaReturn).pipe(catchError(this.handleError))
  }

  deleteTeaReturn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tea-returns/${id}`).pipe(catchError(this.handleError))
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

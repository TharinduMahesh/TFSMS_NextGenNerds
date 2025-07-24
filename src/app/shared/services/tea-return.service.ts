import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import  { TeaReturn } from "../../models/tea-return.model"
import  { Invoice } from "../../models/invoice.model"

@Injectable({
  providedIn: "root",
})
export class TeaReturnService {
  private apiUrl = "https://localhost:7203/api"

  constructor(private http: HttpClient) {}

  getTeaReturns(): Observable<TeaReturn[]> {
    return this.http.get<TeaReturn[]>(`${this.apiUrl}/teareturn`)
  }

  createTeaReturn(teaReturn: TeaReturn): Observable<TeaReturn> {
    return this.http.post<TeaReturn>(`${this.apiUrl}/teareturn`, teaReturn)
  }

  deleteTeaReturn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/teareturn/${id}`)
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`)
  }
}

import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import  { DenaturedTea } from "../../models/denatured-tea.model"
import  { Invoice } from "../../models/invoice.model"

@Injectable({
  providedIn: "root",
})
export class DenaturedTeaService {
  private apiUrl = "https://localhost:7203/api"

  constructor(private http: HttpClient) {}

  getDenaturedTeas(): Observable<DenaturedTea[]> {
    return this.http.get<DenaturedTea[]>(`${this.apiUrl}/denaturedtea`)
  }

  createDenaturedTea(denaturedTea: DenaturedTea): Observable<DenaturedTea> {
    return this.http.post<DenaturedTea>(`${this.apiUrl}/denaturedtea`, denaturedTea)
  }

  deleteDenaturedTea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/denaturedtea/${id}`)
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`)
  }
}




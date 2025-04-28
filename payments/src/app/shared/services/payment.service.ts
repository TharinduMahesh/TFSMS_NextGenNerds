import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/payment.model';
import { PaymentCalculationRequest, PaymentCalculationResult } from '../../models/payment-calculation.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = "http://localhost:5274/api/payments";

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentsBySupplier(supplierId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  calculatePayment(request: PaymentCalculationRequest): Observable<PaymentCalculationResult> {
    return this.http.post<PaymentCalculationResult>(`${this.apiUrl}/calculate`, request);
  }

  getTotalPaymentsAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalAmount`);
  }

  getTotalPaymentsByMethod(method: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalByMethod/${method}`);
  }
}
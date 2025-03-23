// 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://localhost:7078/api/Payment'; 

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  addPayment(payment: Payment): Observable<Payment> {
    // Ensure the amount is sent as a number
    const paymentData = {
      ...payment,
      amount: Number(payment.amount)
    };
    return this.http.post<Payment>(this.apiUrl, paymentData);
  }

  updatePayment(id: number, payment: Payment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

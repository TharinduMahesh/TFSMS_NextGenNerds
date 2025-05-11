import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Payment } from '../../models/payment.model';
import { PaymentCalculationRequest, PaymentCalculationResult } from '../../models/payment-calculation.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiBaseUrl}/api/Payments`;

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Handle the response based on its structure
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object') {
          // If the response is an object, extract the data
          // This handles both { data: [...] } and direct object formats
          return Array.isArray(response.data) ? response.data : [response];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching payments:', error);
        // Return empty array instead of throwing error to prevent app crash
        return of([]);
      })
    );
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        // Handle the response based on its structure
        if (response && typeof response === 'object') {
          // If it's a direct object or has a data property
          return response.data || response;
        }
        throw new Error('Invalid payment data received');
      }),
      catchError(error => {
        console.error(`Error fetching payment ${id}:`, error);
        return throwError(() => new Error('Failed to load payment'));
      })
    );
  }

  getPaymentsBySupplier(SupplierId: number): Observable<Payment[]> {
    return this.http.get<any>(`${this.apiUrl}/Supplier/${SupplierId}`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object') {
          return Array.isArray(response.data) ? response.data : [response];
        }
        return [];
      }),
      catchError(error => {
        console.error(`Error fetching payments for supplier ${SupplierId}:`, error);
        // Return empty array instead of throwing error
        return of([]);
      })
    );
  }

  getPaymentsByDateRange(startDate: string, endDate: string): Observable<Payment[]> {
    return this.http.get<any>(`${this.apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object') {
          return Array.isArray(response.data) ? response.data : [response];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching payments by date range:', error);
        return of([]);
      })
    );
  }

  calculatePayment(request: PaymentCalculationRequest): Observable<PaymentCalculationResult> {
    return this.http.post<any>(`${this.apiUrl}/calculate`, request).pipe(
      map(response => response.data || response),
      catchError(error => {
        console.error('Error calculating payment:', error);
        return throwError(() => new Error('Failed to calculate payment'));
      })
    );
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<any>(this.apiUrl, payment).pipe(
      map(response => response.data || response),
      catchError(error => {
        console.error('Error creating payment:', error);
        return throwError(() => new Error('Failed to create payment'));
      })
    );
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put<any>(`${this.apiUrl}/${payment.paymentId}`, payment).pipe(
      map(response => response.data || response),
      catchError(error => {
        console.error(`Error updating payment ${payment.paymentId}:`, error);
        return throwError(() => new Error('Failed to update payment'));
      })
    );
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting payment ${id}:`, error);
        return throwError(() => new Error('Failed to delete payment'));
      })
    );
  }

  getTotalPaymentsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/count`).pipe(
      map(response => {
        // The response might be a direct number or an object with a data property
        if (typeof response === 'number') {
          return response;
        } else if (response && typeof response === 'object') {
          return typeof response.data === 'number' ? response.data : 0;
        }
        return 0;
      }),
      catchError(error => {
        console.error('Error fetching payments count:', error);
        // Return 0 instead of throwing error
        return of(0);
      })
    );
  }

  getTotalPaymentsAmount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/totalAmount`).pipe(
      map(response => {
        if (typeof response === 'number') {
          return response;
        } else if (response && typeof response === 'object') {
          return typeof response.data === 'number' ? response.data : 0;
        }
        return 0;
      }),
      catchError(error => {
        console.error('Error fetching total payments amount:', error);
        return of(0);
      })
    );
  }

  getTotalPaymentsByMethod(method: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/totalByMethod/${method}`).pipe(
      map(response => {
        if (typeof response === 'number') {
          return response;
        } else if (response && typeof response === 'object') {
          return typeof response.data === 'number' ? response.data : 0;
        }
        return 0;
      }),
      catchError(error => {
        console.error(`Error fetching total payments for method ${method}:`, error);
        return of(0);
      })
    );
  }

  exportPayments(format: string, startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/export?format=${format}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error exporting payments:', error);
        return throwError(() => new Error('Failed to export payments'));
      })
    );
  }
}
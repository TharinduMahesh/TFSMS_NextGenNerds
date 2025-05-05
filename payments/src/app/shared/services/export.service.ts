import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = "http://localhost:5274/api/export";

  constructor(private http: HttpClient) { }

  exportPayments(format: string, startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/payments?format=${format}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get(url, { responseType: 'blob' });
  }

  exportSupplierPayments(supplierId: number, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/supplier/${supplierId}/payments?format=${format}`, { responseType: 'blob' });
  }

  exportAdvances(format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/advances?format=${format}`, { responseType: 'blob' });
  }

  exportDebts(format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/debts?format=${format}`, { responseType: 'blob' });
  }

  exportIncentives(format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/incentives?format=${format}`, { responseType: 'blob' });
  }

  downloadFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
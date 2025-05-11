import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = "https://localhost:7203pi/export";

  constructor(private http: HttpClient) { }

  exportPayments(format: string, startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/payments?format=${format}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get(url, { responseType: 'blob' });
  }

  exportSupplierPayments(SupplierId: number, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/supplier/${SupplierId}/payments?format=${format}`, { responseType: 'blob' });
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
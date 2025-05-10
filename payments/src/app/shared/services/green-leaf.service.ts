import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GreenLeaf } from '../../models/green-leaf.model';

@Injectable({
  providedIn: 'root'
})
export class GreenLeafService {
  private apiUrl = "https://localhost:7203/api/greenleaf";

  constructor(private http: HttpClient) { }

  getGreenLeafData(): Observable<GreenLeaf[]> {
    return this.http.get<GreenLeaf[]>(this.apiUrl);
  }

  getGreenLeafDataBySupplier(supplierId: number): Observable<GreenLeaf[]> {
    return this.http.get<GreenLeaf[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  getLatestGreenLeafWeight(supplierId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/supplier/${supplierId}/latest-weight`);
  }

  getTotalGreenLeafBySupplier(supplierId: number, startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/supplier/${supplierId}/total?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getGreenLeafSummary(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary?startDate=${startDate}&endDate=${endDate}`);
  }
}
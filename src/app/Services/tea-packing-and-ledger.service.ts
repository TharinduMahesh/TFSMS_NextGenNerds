import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeaPackingLedger {
  saleId: string;
  buyerName: string;
  kilosSold: number;
  soldPriceKg: number;
  transactionType: string;
  saleDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeaPackingLedgerService {
  private apiUrl = 'http://localhost:5105/api/teapackingledger';

  constructor(private http: HttpClient) {}

  getLedgers(): Observable<TeaPackingLedger[]> {
    return this.http.get<TeaPackingLedger[]>(this.apiUrl);
  }

  getLedger(saleId: string): Observable<TeaPackingLedger> {
    return this.http.get<TeaPackingLedger>(`${this.apiUrl}/${saleId}`);
  }

  createLedger(ledger: TeaPackingLedger): Observable<TeaPackingLedger> {
    return this.http.post<TeaPackingLedger>(this.apiUrl, ledger);
  }

  updateLedger(ledger: TeaPackingLedger): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${ledger.saleId}`, ledger);
  }

  deleteLedger(saleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${saleId}`);
  }
}
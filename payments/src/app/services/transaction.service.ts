
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://localhost:7078/api/Transaction'; // Update with your actual API endpoint

  constructor(private http: HttpClient) { }

  // Get all transactions
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // Get a single transaction by ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Add a new transaction
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // Update an existing transaction
  updateTransaction(id: number, transaction: Transaction): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, transaction);
  }

  // Delete a transaction by ID
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
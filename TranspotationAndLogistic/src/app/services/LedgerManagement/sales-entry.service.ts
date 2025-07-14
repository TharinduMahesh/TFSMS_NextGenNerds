import { Injectable, signal } from '@angular/core';
import { Sale } from '../../models/LedgerManagement/sales-entry.model';

@Injectable({
  providedIn: 'root'
})
export class SalesEntryService {

  // The signal is now correctly initialized with an empty array.
  sales = signal<Sale[]>([]);

  /**
   * Adds a new sale record to the state.
   * @param newRecord The sale data from the form.
   */
  addSale(newRecord: Omit<Sale, 'id'>): void {
    const fullRecord: Sale = {
      ...newRecord,
      id: new Date().getTime().toString() // Generate a simple unique ID
    };
    
    // Update the signal immutably, adding the new record to the list.
    this.sales.update(currentSales => [...currentSales, fullRecord]);
  }
}
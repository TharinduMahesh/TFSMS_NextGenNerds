import { Injectable, signal } from '@angular/core';
import { TeaReturnRecord } from '../../models/Ledger Management/t-return-entry.model';

@Injectable({
  providedIn: 'root'
})
export class TeaReturnService {
  // Private signal to hold the state. The table is initially empty.
  private recordsState = signal<TeaReturnRecord[]>([]);
  
  // Public, read-only signal for components to consume.
  public records = this.recordsState.asReadonly();

  constructor() {}

  /**
   * Adds a new tea return record to the state.
   * @param newRecordData - The form data for the new record.
   */
  public addRecord(newRecordData: Omit<TeaReturnRecord, 'id' | 'returnNo'>): void {
    const currentRecords = this.recordsState();
    const newId = currentRecords.length > 0 ? Math.max(...currentRecords.map(r => r.id)) + 1 : 1;
    
    const newRecord: TeaReturnRecord = {
      id: newId,
      returnNo: newId, // Using the same as ID for simplicity
      ...newRecordData
    };

    // Update the state by creating a new array with the added record.
    this.recordsState.update(records => [...records, newRecord]);
  }
}
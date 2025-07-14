import { Injectable, signal } from '@angular/core';
import { DenaturedTeaRecord } from '../../models/Ledger Management/denatured-t-entry.model';

@Injectable({
  providedIn: 'root'
})
export class DenaturedTeaService {
  private recordsState = signal<DenaturedTeaRecord[]>([]);
  public records = this.recordsState.asReadonly();

  constructor() {
  
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const initialRecord: DenaturedTeaRecord = {
      id: 1,
      recordNo: 1,
      teaGrade: 'A',
      quantity: 34,
      reason: 'Expired'
    };
    this.recordsState.set([initialRecord]);
  }

  public addRecord(newRecordData: Omit<DenaturedTeaRecord, 'id' | 'recordNo'>): void {
    const currentRecords = this.recordsState();
    const newId = currentRecords.length > 0 ? Math.max(...currentRecords.map(r => r.id)) + 1 : 1;
    
    const newRecord: DenaturedTeaRecord = {
      id: newId,
      recordNo: currentRecords.length + 1,
      ...newRecordData
    };

    this.recordsState.update(records => [...records, newRecord]);
  }
}
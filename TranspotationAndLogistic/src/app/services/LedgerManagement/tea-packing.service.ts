import { Injectable, signal } from '@angular/core';
import { TeaPacking } from '../../models/Ledger Management/tea-packing.model';

@Injectable({
  providedIn: 'root'
})
export class TeaPackingService {
  private packingRecords = signal<TeaPacking[]>([]);
  
  // Expose as readonly signal
  readonly records = this.packingRecords.asReadonly();

  addRecord(record: TeaPacking): void {
    const newRecord = {
      ...record,
      id: this.generateId()
    };
    this.packingRecords.update(records => [...records, newRecord]);
  }

  removeRecord(id: string): void {
    this.packingRecords.update(records => 
      records.filter(record => record.id !== id)
    );
  }

  clearAllRecords(): void {
    this.packingRecords.set([]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
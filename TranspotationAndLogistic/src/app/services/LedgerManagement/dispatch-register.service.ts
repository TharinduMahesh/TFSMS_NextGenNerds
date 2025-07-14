import { Injectable, signal } from '@angular/core';
import { Dispatch } from '../../models/LedgerManagement/dispatch-register.model';

@Injectable({
  providedIn: 'root'
})
export class DispatchRegisterService {
  private dispatchCounter = signal(1); 

  dispatches = signal<Dispatch[]>([]);

  
  addDispatch(newRecord: Omit<Dispatch, 'id' | 'dispatchNo'>): void {
    const newDispatch: Dispatch = {
      ...newRecord,
      id: new Date().getTime().toString(), 
      dispatchNo: this.dispatchCounter()
    };

    
    this.dispatches.update(currentDispatches => [...currentDispatches, newDispatch]);
    
    this.dispatchCounter.update(count => count + 1);
  }
}
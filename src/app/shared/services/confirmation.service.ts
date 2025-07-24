import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmationState {
  show: boolean;
  message: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationSubject = new Subject<ConfirmationState>();
  public confirmationState$ = this.confirmationSubject.asObservable();

  constructor() { }

  confirm(message: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.confirmationSubject.next({
        show: true,
        message,
        resolve
      });
    });
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Use a BehaviorSubject to hold the current state (true = open, false = closed)
  // It's initialized to 'false' (closed).
  private sidebarOpen = new BehaviorSubject<boolean>(false);

  // Expose the state as an Observable for components to subscribe to
  sidebarOpen$ = this.sidebarOpen.asObservable();

  constructor() { }

  toggle(): void {
    // Invert the current value and push it to the stream
    this.sidebarOpen.next(!this.sidebarOpen.value);
  }

  close(): void {
    // Explicitly close the sidebar
    this.sidebarOpen.next(false);
  }
}
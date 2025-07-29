import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

export interface Toast {
  id: number
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timeout?: number
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toasts: Toast[] = []
  private toastCounter = 0
  private defaultTimeout = 5000 // 5 seconds

  toastsChanged = new Subject<Toast[]>()

  constructor() {}

  showSuccess(title: string, message: string, timeout?: number): void {
    this.show({
      id: this.getNextId(),
      type: "success",
      title,
      message,
      timeout: timeout || this.defaultTimeout,
    })
  }

  showError(title: string, message: string, timeout?: number): void {
    this.show({
      id: this.getNextId(),
      type: "error",
      title,
      message,
      timeout: timeout || this.defaultTimeout,
    })
  }

  showInfo(title: string, message: string, timeout?: number): void {
    this.show({
      id: this.getNextId(),
      type: "info",
      title,
      message,
      timeout: timeout || this.defaultTimeout,
    })
  }

  showWarning(title: string, message: string, timeout?: number): void {
    this.show({
      id: this.getNextId(),
      type: "warning",
      title,
      message,
      timeout: timeout || this.defaultTimeout,
    })
  }

  showLoading(title: string, message: string): number {
    const toast: Toast = {
      id: this.getNextId(),
      type: 'info', // Use the 'info' style for the loading indicator
      title,
      message,
      // We explicitly DO NOT set a timeout, so it stays forever
    };
    
    this.show(toast); // Call the existing private method to display it
    
    return toast.id; // Return the ID for later removal
  }



  private show(toast: Toast): void {
    this.toasts.push(toast)
    this.toastsChanged.next([...this.toasts])

    // Auto-remove toast after timeout
    if (toast.timeout) {
      setTimeout(() => {
        this.remove(toast.id)
      }, toast.timeout)
    }
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.toastsChanged.next([...this.toasts])
  }

  clear(): void {
    this.toasts = []
    this.toastsChanged.next([])
  }

  private getNextId(): number {
    return ++this.toastCounter
  }
}

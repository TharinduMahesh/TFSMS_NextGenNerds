
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
<<<<<<< HEAD:src/app/components/toast/toast.component.ts
import { Toast, ToastService } from '../../shared/Services/toast.service'; // Adjust path if needed
=======
import { Toast, ToastService } from '../../../shared/services/toast.service'; // Adjust path if needed
>>>>>>> main:src/app/components/Notification/toast/toast.component.ts

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private toastSub: Subscription | undefined;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSub = this.toastService.toastsChanged.subscribe((toasts: Toast[]) => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    if (this.toastSub) {
      this.toastSub.unsubscribe();
    }
  }

  // Allow users to manually close a toast
  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  // Helper to get the right icon class
  getIconClass(type: 'success' | 'error' | 'info' | 'warning'): string {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-times-circle';
      case 'info': return 'fas fa-info-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
    }
  }
}
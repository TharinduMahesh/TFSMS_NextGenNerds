import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmationService, ConfirmationState } from '../../../shared/services/confirmation.service'; // Adjust path if needed

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  show = false;
  message = 'Are you sure?';
  private resolve?: (value: boolean) => void;
  private subscription: Subscription | undefined;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.confirmationState$.subscribe(
      (state: ConfirmationState) => {
        this.show = state.show;
        this.message = state.message;
        this.resolve = state.resolve;
      }
    );
  }

  onConfirm(): void {
    this.show = false;
    if (this.resolve) {
      this.resolve(true);
    }
  }

  onCancel(): void {
    this.show = false;
    if (this.resolve) {
      this.resolve(false);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
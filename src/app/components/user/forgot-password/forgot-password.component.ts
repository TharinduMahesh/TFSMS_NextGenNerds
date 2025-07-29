import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: ReturnType<FormBuilder['group']>;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    
    const email = this.forgotPasswordForm.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Show the generic success message from the backend
        this.toastService.showSuccess('Request Sent', res.message);
        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.showError('Error', 'An unexpected error occurred. Please try again.');
      }
    });
  }
}
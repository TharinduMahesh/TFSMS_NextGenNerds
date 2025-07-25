import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from '../../../shared/confirm-password.validator';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service'; // For professional notifications

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        // Using the password strength validator you already have
        ConfirmPasswordValidator.PasswordStrength()
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: ConfirmPasswordValidator.MatchValidator('newPassword', 'confirmPassword')
    });
  }

  // Helper for easy access to form controls in the template
  get f() { return this.changePasswordForm.controls; }

  onSubmit(): void {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.invalid) {
      this.toastService.showError('Invalid Form', 'Please correct the errors below.');
      return;
    }

    this.isLoading = true;
    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.showSuccess('Success!', 'Password changed successfully. You will be logged out for security.');
        
        // Log the user out after a successful password change
        setTimeout(() => {
          this.authService.logout();
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        // Extract a user-friendly error from the backend response
        const errorDetails = err.error?.errors?.[0]?.description;
        const defaultMessage = "Failed to change password. Please check your current password.";
        this.toastService.showError('Update Failed', errorDetails || err.error?.message || defaultMessage);
      }
    });
  }
}
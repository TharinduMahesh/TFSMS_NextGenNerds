import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from '../../../shared/confirm-password.validator';
import { UserService } from '../../../shared/services/user.service'; // We will add the method here

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
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Using UserService for this action
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6)
        // Add more validators if your backend policy is stricter
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: ConfirmPasswordValidator.MatchValidator('newPassword', 'confirmPassword')
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.showAlert('Please fill in all fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    this.alertMessage = null;

    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showAlert('Password changed successfully! You will be logged out for security.', 'success');
        // It's good practice to log the user out after a password change
        setTimeout(() => {
          // You would call your authService.logout() here
          // For now, let's just navigate. You'll need to inject AuthService for a full logout.
          this.router.navigate(['/sign-in']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.errors?.[0]?.description || err.error?.message || 'An unknown error occurred.';
        this.showAlert(errorMessage, 'error');
      }
    });
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
  }
}
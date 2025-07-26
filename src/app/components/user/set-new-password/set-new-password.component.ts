

import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import {  ActivatedRoute,  Router, RouterModule } from "@angular/router"
import  { AuthService } from "../../../shared/services/auth.service"
import { ConfirmPasswordValidator } from "../../../shared/confirm-password.validator" 
import { ToastService } from "../../../shared/services/toast.service"
@Component({
  selector: "app-set-new-password",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule ],
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.css"],
})
export class SetNewPasswordComponent implements OnInit {
  setPasswordForm: FormGroup
  token: string | null = null
  alertMessage = ""
  showAlert = false
  alertType = "" // 'success', 'error'
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService 
  ) {
    this.setPasswordForm = this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            ConfirmPasswordValidator.PasswordStrength() ,
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: ConfirmPasswordValidator.MatchValidator("newPassword", "confirmPassword"),
      },
    )
  }

  get f() {
    return this.setPasswordForm.controls;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get("token");
    if (!this.token) {
      this.toastService.showError("Error", "No password reset token was found. Please use the link from your email.");
      setTimeout(() => this.router.navigate(["/sign-in"]), 3000);
    }
  }

  onSubmit(): void {
  this.setPasswordForm.markAllAsTouched();

  if (this.setPasswordForm.invalid) {
    this.toastService.showError('Invalid Form', 'Please ensure passwords match and meet all requirements.');
    return; // Stop execution
  }
  
  if (!this.token) {
    this.toastService.showError('Error', 'No password reset token was found.');
    return;
  }

  this.isLoading = true;

  const newPassword = this.setPasswordForm.get("newPassword")?.value;

  this.authService.setNewPassword({ Token: this.token, NewPassword: newPassword }).subscribe({
    next: (res) => {
      // --- SUCCESS CASE ---
      this.isLoading = false;
      this.setPasswordForm.reset();
      
      this.toastService.showSuccess(
        'Success!',
        'Your password has been set. You can now log in.'
      );
      
      setTimeout(() => {
        this.router.navigate(["/sign-in"]);
      }, 2500); // A bit longer so the user can read the success toast
    },
    error: (err) => {
      this.isLoading = false;
      
      const errorMessage = err.error?.message || "Invalid or expired token.";
      this.toastService.showError('Password Set Failed', errorMessage);
    },
  });
}
  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message
    this.alertType = type
    this.showAlert = true
    setTimeout(() => {
      this.showAlert = false
    }, 5000)
  }

  closeAlert() {
    this.showAlert = false
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.setPasswordForm.get(controlName)
    return !!control?.hasError(errorName) && (control?.dirty || control?.touched)
  }

  
}

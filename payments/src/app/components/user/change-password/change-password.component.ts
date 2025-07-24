import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import { ConfirmPasswordValidator } from "../../../shared/confirm-password.validator"
import  { UserService } from "../../../shared/services/user.service"
import  { AuthService } from "../../../shared/services/auth.service"

@Component({
  selector: "app-change-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup
  isLoading = false
  alertMessage: string | null = null
  alertType: "success" | "error" | null = null

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            // Match ASP.NET Core Identity's default stricter policy
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{6,}$/),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: ConfirmPasswordValidator.MatchValidator("newPassword", "confirmPassword"),
      },
    )
  }

  // Helper function to easily check for errors in the template
  get f() {
    return this.changePasswordForm.controls
  }

  onSubmit(): void {
    // Mark all fields as touched to display errors
    this.changePasswordForm.markAllAsTouched()
    if (this.changePasswordForm.invalid) {
      this.showAlert("Please correct the errors below.", "error")
      return
    }

    // ✅ Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.showAlert("You are not authenticated. Please sign in again.", "error")
      this.router.navigate(["/sign-in"])
      return
    }

    this.isLoading = true
    this.alertMessage = null

    const { currentPassword, newPassword } = this.changePasswordForm.value

    console.log("🔍 Attempting password change...")

    this.userService
      .changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
      })
      .subscribe({
        next: (res) => {
          console.log("✅ Password change successful:", res)
          this.isLoading = false
          this.showAlert("Password changed successfully! You will be logged out for security.", "success")

          setTimeout(() => {
            this.authService.logout()
            this.router.navigate(["/sign-in"])
          }, 3000)
        },
        error: (err) => {
          console.error("❌ Password change error:", err)
          this.isLoading = false

          if (err.status === 401) {
            this.showAlert("Your session has expired. Please sign in again.", "error")
            setTimeout(() => {
              this.authService.logout()
              this.router.navigate(["/sign-in"])
            }, 2000)
            return
          }

          const errorDetails = err.error?.errors?.[0]?.description
          this.showAlert(
            errorDetails || err.error?.message || "An error occurred while changing your password.",
            "error",
          )
        },
      })
  }

  showAlert(message: string, type: "success" | "error"): void {
    this.alertMessage = message
    this.alertType = type
    // Auto-hide the alert after some time
    setTimeout(() => (this.alertMessage = null), 7000)
  }
}

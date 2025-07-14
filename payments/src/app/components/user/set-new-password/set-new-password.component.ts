import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import {  ActivatedRoute,  Router, RouterModule } from "@angular/router"
import  { AuthService } from "../../../shared/services/auth.service"
import { ConfirmPasswordValidator } from "../../../shared/confirm-password.validator" // Assuming you have this validator

@Component({
  selector: "app-set-new-password",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.css"],
})
export class SetNewPasswordComponent implements OnInit {
closeAlert() {
throw new Error('Method not implemented.')
}
  setPasswordForm: FormGroup
  // token: string | null = null
  alertMessage = ""
  showAlert = false
  alertType = "" // 'success', 'error'
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {
    this.setPasswordForm = this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*[0-9])(?=.*[!@#$%^&*])/), // Example pattern
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: ConfirmPasswordValidator.MatchValidator("newPassword", "confirmPassword"),
      },
    )
  }

 token: string | null = null;

// ngOnInit(): void {
//   this.token = this.route.snapshot.queryParamMap.get("token");

//   if (!this.token) {
//     this.showAlertMessage("No token provided. Please use the link from your email.", "error");
//     setTimeout(() => this.router.navigate(["/sign-in"]), 3000);
//   }
// }

ngOnInit(): void {
  this.token = this.route.snapshot.queryParamMap.get("token") || localStorage.getItem("resetToken");
  if (!this.token) {
    this.showAlertMessage("No token provided. Please use the link from your email.", "error");
    setTimeout(() => this.router.navigate(["/sign-in"]), 3000);
  }

}


  onSubmit(): void {
  this.isLoading = true;

  if (this.setPasswordForm.valid && this.token) {
    const newPassword = this.setPasswordForm.get("newPassword")?.value;

    this.authService.setNewPassword({ token: this.token, newPassword }).subscribe({
      next: (res) => {
        this.showAlertMessage("Password set successfully! You can now log in.", "success");
        this.isLoading = false;
        this.setPasswordForm.reset();
        setTimeout(() => this.router.navigate(["/sign-in"]), 2000);
      },
      error: (err) => {
        console.error("Error setting password:", err);
        this.showAlertMessage(
          "Failed to set password: " + (err.error?.message || "Invalid or expired token."),
          "error"
        );
        this.isLoading = false;
      },
    });
  } else {
    this.showAlertMessage("Please ensure passwords match and meet requirements.", "error");
    this.isLoading = false;
  }
}


// onSubmit(): void {

//     this.isLoading = true

//     if (this.setPasswordForm.valid) {

//       const newPassword = this.setPasswordForm.get("newPassword")?.value

//       const username = localStorage.getItem("Username") || ""; // Retrieve username from localStorage

//       this.authService.setNewPassword(username,newPassword).subscribe({

//         next: (res) => {

//           this.showAlertMessage("Password set successfully! You can now log in.", "success")

//           this.isLoading = false

//           this.setPasswordForm.reset()

//           setTimeout(() => this.router.navigate(["/sign-in"]), 2000)

//         },

//         error: (err) => {

//           console.error("Error setting password:", err)

//           this.showAlertMessage(

//             "Failed to set password: " + (err.error?.message || "Invalid or expired token."),

//             "error",

//           )

//           this.isLoading = false

//         },

//       })

//     } else {

//       this.showAlertMessage("Please ensure passwords match and meet requirements.", "error")

//       this.isLoading = false

//     }

//   }



  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message
    this.alertType = type
    this.showAlert = true
    setTimeout(() => {
      this.showAlert = false
    }, 5000)
  }

  // Helper to check if a form control has a specific error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.setPasswordForm.get(controlName)
    return !!control?.hasError(errorName) && (control?.dirty || control?.touched)
  }
}

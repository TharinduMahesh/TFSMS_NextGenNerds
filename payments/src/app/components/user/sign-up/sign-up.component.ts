import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl,  FormBuilder } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../../header/header.component"
import { FooterComponent } from "../../footer/footer.component"
import {  ValidatorFn, Validators } from "@angular/forms"
import  { AuthService } from "../../../shared/services/auth.service"
import  { Router } from "@angular/router"
import { FirstKeyPipe } from "../../../shared/pipes/first-key-pipe.pipe"
import { HttpClientModule } from "@angular/common/http"

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    FirstKeyPipe,
    HttpClientModule,
  ],
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit {
  type = "password"
  isText = false
  eyeIcon = "fa-eye-slash"
  form: FormGroup
  isSubmitted = false
  menuOpen = false
  isLoading = false
  // Add alert message properties
  alertMessage = ""
  showAlert = false
  alertType = "" // 'success', 'error', or 'warning'

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get("password")
    const confirmPassword = control.get("confirmPassword")
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ mismatch: true })
    } else {
      confirmPassword?.setErrors(null)
    }
    return null
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        Email: ["", [Validators.required, Validators.email]],
        MobileNo: ["", Validators.required],
        password: [
          "",
          [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[0-9])(?=.*[!@#$%^&*])/)],
        ],
        confirmPassword: [""],
        // Removed: role: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    // Only check login status in browser environment
    if (typeof window !== "undefined" && this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/dashboard")
    }
    // Check if there's a success message in localStorage from a previous registration
    if (typeof window !== "undefined") {
      const successMsg = localStorage.getItem("signupSuccess")
      if (successMsg) {
        this.showAlertMessage(successMsg, "success")
        localStorage.removeItem("signupSuccess")
      }
    }
  }

  // Add method to show alert messages
  showAlertMessage(message: string, type: string) {
    this.alertMessage = message
    this.alertType = type
    this.showAlert = true
    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      this.showAlert = false
    }, 5000)
  }

  onSubmit() {
    this.isSubmitted = true
    this.isLoading = true
    if (this.form.valid) {
      this.authService.createUser(this.form.value).subscribe({
        next: (response: any) => {
          this.isLoading = false
          if (response.succeeded) {
            console.log("User registered successfully", response)
            this.form.reset()
            this.isSubmitted = false
            // Show success message
            this.showAlertMessage("Your account has been created successfully. Please sign in.", "success")
            if (typeof window !== "undefined") {
              localStorage.setItem("signupSuccess", "Your account has been created successfully. Please sign in.")
            }
            // Redirect to sign-in page after a short delay
            setTimeout(() => {
              this.router.navigateByUrl("/sign-in")
            }, 2000)
          } else {
            // Handle different error cases from the API
            if (response.error === "existing_user") {
              this.showAlertMessage(
                "A user with this email already exists. Please use a different email or sign in.",
                "warning",
              )
            } else {
              this.showAlertMessage("Registration failed: " + (response.message || "Unknown error"), "error")
            }
          }
        },
        error: (error) => {
          this.isLoading = false
          console.error("Error registering user", error)
          // Show error message
          if (error.status === 400) {
            // HTTP 409 Conflict - typically used for duplicate resource
            this.showAlertMessage(
              "A user with this email already exists. Please use a different email or sign in.",
              "warning",
            )
          } else {
            this.showAlertMessage(
              "Registration failed: " + (error.message || "Server error. Please try again later."),
              "error",
            )
          }
        },
      })
    } else {
      this.isLoading = false
      this.showAlertMessage("Please fill in all required fields correctly.", "error")
    }
  }

  hasDisplayError(controlName: string): boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  toggleMenu(): void {
    console.log("Hamburger menu clicked!")
    this.menuOpen = !this.menuOpen
  }

  // Method to close the alert
  closeAlert() {
    this.showAlert = false
  }

  hideShowPass() {
    this.isText = !this.isText
    this.isText ? (this.eyeIcon = "fa-eye") : (this.eyeIcon = "fa-eye-slash")
    this.isText ? (this.type = "text") : (this.type = "password")
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field)
      if (control instanceof AbstractControl) {
        control.markAsTouched({ onlySelf: true })
      }
      if (control && typeof control === "object" && control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }
}

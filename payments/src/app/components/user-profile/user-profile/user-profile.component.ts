import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { AuthService } from "../../../shared/services/auth.service"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup
  alertMessage = ""
  showAlert = false
  alertType = "" // 'success', 'error'
  isLoading = false
  userRole = "" // To display the user's role

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.profileForm = this.fb.group({
      Email: [{ value: "", disabled: true }, [Validators.required, Validators.email]], // Email is read-only
      FirstName: ["", Validators.required],
      LastName: ["", Validators.required],
      MobileNo: ["", Validators.required],
      Role: [{ value: "", disabled: true }], // Role is read-only
    })
  }

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    this.isLoading = true
    this.authService.getCurrentUserProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          Email: data.email,
          FirstName: data.firstName,
          LastName: data.lastName,
          MobileNo: data.mobileNo,
          Role: data.role,
        })
        this.userRole = data.role // Store role for display
        this.isLoading = false
      },
      error: (err) => {
        console.error("Error loading user profile:", err)
        this.showAlertMessage("Failed to load profile.", "error")
        this.isLoading = false
      },
    })
  }

  onSubmit(): void {
    this.isLoading = true
    // Ensure only editable fields are sent
    const updateData = {
      FirstName: this.profileForm.get("FirstName")?.value,
      LastName: this.profileForm.get("LastName")?.value,
      MobileNo: this.profileForm.get("MobileNo")?.value,
    }

    if (this.profileForm.valid) {
      this.authService.updateCurrentUserProfile(updateData).subscribe({
        next: () => {
          this.showAlertMessage("Profile updated successfully!", "success")
          this.isLoading = false
        },
        error: (err) => {
          console.error("Error updating profile:", err)
          this.showAlertMessage("Failed to update profile. " + (err.error?.message || ""), "error")
          this.isLoading = false
        },
      })
    } else {
      this.showAlertMessage("Please fill in all required fields correctly.", "error")
      this.isLoading = false
    }
  }

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
    const control = this.profileForm.get(controlName)
    return !!control?.hasError(errorName) && (control?.dirty || control?.touched)
  }
}

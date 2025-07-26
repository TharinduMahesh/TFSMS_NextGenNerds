import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import { RouterModule,  Router } from "@angular/router" // Import Router
import  { UserService } from "../../../shared/Services/user.service"
import  { AuthService } from "../../../shared/Services/auth.service" // Import AuthService for isLoggedIn check


@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup
  alertMessage = ""
  showAlert = false
  alertType = "" // 'success', 'error'
  isLoading = false
  currentUserId: string | null = null

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router, // Inject Router for navigation
  ) {
    this.userProfileForm = this.fb.group({
      Email: [{ value: "", disabled: true }, [Validators.required, Validators.email]], // Email is read-only
      FirstName: ["", Validators.required],
      LastName: ["", Validators.required],
      MobileNo: ["", Validators.required],
      Role: [{ value: "", disabled: true }], // Role is read-only for user's own profile
    })
  }

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    this.isLoading = true
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.currentUserId = data.id // Use 'id' from backend DTO
        this.userProfileForm.patchValue({
          Email: data.email, // Use 'email' from backend DTO
          FirstName: data.firstName, // Use 'firstName' from backend DTO
          LastName: data.lastName, // Use 'lastName' from backend DTO
          MobileNo: data.mobileNo, // Use 'mobileNo' from backend DTO
          Role: data.role, // Use 'role' from backend DTO
        })
        this.isLoading = false
      },
      error: (err) => {
        console.error("Error loading user profile:", err)
        this.showAlertMessage("Failed to load user profile.", "error")
        this.isLoading = false
      },
    })
  }

  onSubmit(): void {
    if (this.userProfileForm.valid) {
      this.isLoading = true
      // Use getRawValue() to get values from disabled fields as well
      const { FirstName, LastName, MobileNo } = this.userProfileForm.getRawValue()
      this.userService.updateUserProfile({ FirstName, LastName, MobileNo }).subscribe({
        next: (res) => {
          this.showAlertMessage("Profile updated successfully!", "success")
          this.isLoading = false
          // Optionally reload profile to ensure data consistency
          this.loadUserProfile()
        },
        error: (err) => {
          console.error("Error updating profile:", err)
          this.showAlertMessage("Failed to update profile. " + (err.error?.message || ""), "error")
          this.isLoading = false
        },
      })
    } else {
      this.showAlertMessage("Please fill in all required fields correctly.", "error")
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

  closeAlert() {
    this.showAlert = false
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }
}

import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { AuthService } from "../../../shared/Services/auth.service"
import { RouterModule } from "@angular/router"
import  { ToastService } from "../../../shared/Services/toast.service" // Import ToastService
import { ConfirmationService } from "../../../shared/Services/confirmation.service"


@Component({
  selector: "app-admin-user-management",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./admin-user-management.component.html",
  styleUrls: ["./admin-user-management.component.css"],
})
export class AdminUserManagementComponent implements OnInit {
  userForm: FormGroup
  users: any[] = []
  roles: string[] = ["full-admin", "transport-administrator", "floor-manager", "pending", "public-user"] // Define available roles
  selectedUserId: string | null = null
  alertMessage =  " "
  showAlert = false
  alertType = "" // 'success', 'error'

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService ,
    private confirmationService: ConfirmationService // Inject ConfirmationService
  ) {
    this.userForm = this.fb.group({
      Email: ["", [Validators.required, Validators.email]],
      FirstName: ["", Validators.required],
      LastName: ["", Validators.required],
      MobileNo: ["", Validators.required],
      Role: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data
      },
      error: (err) => {
        console.error("Error loading users:", err)
        this.showAlertMessage("Failed to load users.", "error")
      },
    })
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.selectedUserId) {
        // Update existing user
        // Use getRawValue() to include disabled fields like Email if needed by backend,
        // though for update, Email is usually not changed.
        const userData = this.userForm.getRawValue()
        this.authService.updateUserByAdmin(this.selectedUserId, userData).subscribe({
          next: (res) => {
            this.showAlertMessage("User updated successfully!", "success")
            this.resetForm()
            this.loadUsers()
          },
          error: (err) => {
            console.error("Error updating user:", err)
            this.showAlertMessage("Failed to update user.", "error")
          },
        })
      } else {
        // Create new user
        // The backend's CreateUserByAdmin endpoint does NOT expect a password here.
        // It will create the user and send a set-password link.
        const newUser = {
          Email: this.userForm.value.Email,
          FirstName: this.userForm.value.FirstName,
          LastName: this.userForm.value.LastName,
          MobileNo: this.userForm.value.MobileNo,
          Role: this.userForm.value.Role,
        }
        this.authService.createUserByAdmin(newUser).subscribe({
          next: (res) => {
            this.showAlertMessage("User created and set-password link sent!", "success")
            console.log("Set password link:", res.setPasswordLink) // Log the link for testing
            this.resetForm()
            this.loadUsers()
          },
          error: (err) => {
            console.error("Error creating user:", err)
            this.showAlertMessage("Failed to create user. " + (err.error?.message || ""), "error")
          },
        })
      }
    } else {
      this.showAlertMessage("Please fill in all required fields.", "error")
    }
  }

  editUser(user: any): void {
    this.selectedUserId = user.Id
    this.userForm.patchValue({
      Email: user.Email,
      FirstName: user.firstName, // Note: Backend sends 'firstName', not 'FirstName' in DTO
      LastName: user.lastName, // Note: Backend sends 'lastName', not 'LastName' in DTO
      MobileNo: user.mobileNo, // Note: Backend sends 'mobileNo', not 'MobileNo' in DTO
      Role: user.role, // Note: Backend sends 'role', not 'Role' in DTO
    })
    // Disable email field for editing
    this.userForm.get("Email")?.disable()
  }


//   resetPassword(userId: string): void {
//   const user = this.users.find(u => u.id === userId);
//   const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';
  
//   const confirmation = confirm(`Are you sure you want to reset the password for ${userName}? They will be forced to change it on their next login.`);
  
//   if (confirmation) {
//     this.authService.resetUserPasswordByAdmin(userId).subscribe({
      
//       next: (res) => {
//         // --- THIS IS THE REPLACEMENT ---
//         // Instead of showAlertMessage, we call the toast service.
//         // The first argument is the title, the second is the message.
//         this.toastService.showSuccess('Success!', `Password for ${userName} has been reset.`);
//       },
      
//       error: (err) => {
//         const errorMessage = err.error?.message || "Failed to reset password.";
//         // --- THIS IS THE REPLACEMENT ---
//         this.toastService.showError('Error', errorMessage);
//       }

//       // The `complete` block is not needed for this logic, you can keep it or remove it.
//     });
//   }
// }


 async resetPassword(userId: string): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';
    
    // --- THIS IS THE REPLACEMENT ---
    // We 'await' the result of the promise from our service.
    const confirmation = await this.confirmationService.confirm(
      `Are you sure you want to reset the password for ${userName}? They will be forced to change it on their next login.`
    );
    // --- END OF REPLACEMENT ---
    
    if (confirmation) {
      // The rest of the logic remains the same.
      this.authService.resetUserPasswordByAdmin(userId).subscribe({
        next: (res) => {
          this.toastService.showSuccess('Success!', `Password for ${userName} has been reset.`);
        },
        error: (err) => {
          const errorMessage = err.error?.message || "Failed to reset password.";
          this.toastService.showError('Error', errorMessage);
        }
      });
    }
  }

  deleteUser(userId: string): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.authService.deleteUserByAdmin(userId).subscribe({
        next: (res) => {
          this.showAlertMessage("User deleted successfully!", "success")
          this.loadUsers()
        },
        error: (err) => {
          console.error("Error deleting user:", err)
          this.showAlertMessage("Failed to delete user.", "error")
        },
      })
    }
  }

  resetForm(): void {
    this.userForm.reset()
    this.selectedUserId = null
    this.userForm.get("Email")?.enable() // Re-enable email field
    this.userForm.get("Role")?.setValue("") // Reset role dropdown
  }

 showAlertMessage(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}

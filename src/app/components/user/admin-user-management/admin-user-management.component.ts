import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { AuthService } from "../../../shared/services/auth.service"
import { RouterModule } from "@angular/router"
import  { ToastService } from "../../../shared/services/toast.service" 
import { ConfirmationService } from "../../../shared/services/confirmation.service"


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
  roles: string[] = ["full-admin", "transport-administrator", "floor-manager", "pending", "public-user"] 
  selectedUserId: string | null = null
  alertMessage =  " "
  showAlert = false
  alertType = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService ,
    private confirmationService: ConfirmationService 
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
  this.userForm.markAllAsTouched();

  if (this.userForm.valid) {
    if (this.selectedUserId) {
      const userData = this.userForm.getRawValue();
      this.authService.updateUserByAdmin(this.selectedUserId, userData).subscribe({
        next: (res) => {
          this.toastService.showSuccess('Success!', 'User updated successfully!');
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'An unknown error occurred.';
          this.toastService.showError('Update Failed', errorMessage);
        },
      });
    } else {
      const newUser = this.userForm.value;
      this.authService.createUserByAdmin(newUser).subscribe({
        next: (res) => {
          this.toastService.showSuccess('User Created!', 'User has been created with a temporary password.');
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          const errorMessage = err.status === 409 
            ? 'A user with this email already exists.'
            : err.error?.message || 'An unknown error occurred.';
          this.toastService.showError('Creation Failed', errorMessage);
        },
      });
    }
  } else {
    this.toastService.showError('Invalid Form', 'Please fill in all required fields correctly.');
  }
}

  editUser(user: any): void {
    this.selectedUserId = user.Id
    this.userForm.patchValue({
      Email: user.Email,
      FirstName: user.firstName, 
      LastName: user.lastName, 
      MobileNo: user.mobileNo, 
      Role: user.role, 
    })
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
  
  const confirmation = await this.confirmationService.confirm(
    `Are you sure you want to reset the password for ${userName}?`
  );
  
  if (confirmation) {
    const loadingToastId = this.toastService.showLoading('Processing...', `Resetting password for ${userName}.`);

    this.authService.resetUserPasswordByAdmin(userId).subscribe({
      next: (res) => {
        this.toastService.remove(loadingToastId);
        this.toastService.showSuccess('Success!', `Password for ${userName} has been reset.`);
      },
      error: (err) => {
        this.toastService.remove(loadingToastId);
        const errorMessage = err.error?.message || "Failed to reset password.";
        this.toastService.showError('Error', errorMessage);
      }
    });
  }
}

  async deleteUser(userId: string): Promise<void> {
  const user = this.users.find(u => u.id === userId);
  const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';

  const confirmation = await this.confirmationService.confirm(
    `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`
  );

  if (confirmation) {
    const loadingToastId = this.toastService.showLoading('Deleting...', `Removing user ${userName}.`);

    this.authService.deleteUserByAdmin(userId).subscribe({
      next: (res) => {
        this.toastService.remove(loadingToastId);
        this.toastService.showSuccess('Success!', 'User has been deleted successfully.');
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.remove(loadingToastId);
        const errorMessage = err.error?.message || "Failed to delete user.";
        this.toastService.showError('Delete Failed', errorMessage);
      },
    });
  }
}

  resetForm(): void {
    this.userForm.reset()
    this.selectedUserId = null
    this.userForm.get("Email")?.enable() 
    this.userForm.get("Role")?.setValue("") 
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

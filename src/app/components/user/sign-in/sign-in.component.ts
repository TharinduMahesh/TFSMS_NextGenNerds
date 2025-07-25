import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../../header/header.component"
import { FooterComponent } from "../../footer/footer.component"
import {  FormBuilder, Validators } from "@angular/forms"
import  { AuthService } from "../../../shared/services/auth.service"
import  { Router } from "@angular/router"
import  { ToastService } from "../../../shared/services/toast.service" // Import ToastService

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  form: any
  isSubmitted = false
  menuOpen = false
  isLoading = false
  successMessage: string | null = null

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastService: ToastService // Inject ToastService
  ) {
    this.form = this.formBuilder.group({
      Email: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false],
    })
  }

  ngOnInit(): void {
    // Only check login status in browser environment
    if (typeof window !== "undefined" && this.service.isLoggedIn()) {
      this.router.navigateByUrl("/dashboard")
    }
    const signupSuccess = localStorage.getItem("signupSuccess")
    if (signupSuccess) {
      this.successMessage = signupSuccess
      localStorage.removeItem("signupSuccess")
    }
  }

  hasDisplayError(controlName: string): boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  // onSubmit() {
  //       this.isSubmitted = true;
  //       this.successMessage = null;

  //       if (this.form.valid) {
  //           this.service.signin(this.form.value).subscribe({
  //               next: (res: any) => {
  //                   // --- NEW LOGIC STARTS HERE ---
  //                   // Check for the 'forcePasswordChange' flag from our backend.
  //                   if (res.forcePasswordChange && res.token) {
  //                       // This is a user with a temporary password.
  //                       alert("You must change your temporary password before continuing.");
                        
  //                       // Navigate to the existing set-password page, passing the one-time token.
  //                       this.router.navigate(['/set-password'], { queryParams: { token: res.token } });

  //                   } else if (res.token) {
  //                       // This is a normal, successful login.
  //                       this.service.savetoken(res.token);
  //                       this.successMessage = "Sign in successful! Redirecting...";
  //                       setTimeout(() => {
  //                           this.router.navigateByUrl("/dashboard");
  //                       }, 1500);

  //                   } else {
  //                       // This handles any unexpected problems.
  //                       alert("An unexpected login error occurred. Please try again.");
  //                   }
  //                   // --- NEW LOGIC ENDS HERE ---
  //               },
  //               error: (err) => {
  //                   if (err.status == 400) {
  //                       alert("Invalid username or password");
  //                   } else {
  //                       alert("Something went wrong. Please try again.");
  //                   }
  //               },
  //           });
  //       }
    
  // }
// In src/app/pages/authentication/sign-in/sign-in.component.ts

onSubmit() {
  this.isSubmitted = true;

  if (this.form.valid) {
    this.service.signin(this.form.value).subscribe({
      next: (res: any) => {
        // --- UPDATED LOGIC USING TOASTS ---
        
        if (res.forcePasswordChange && res.token) {
          // Flow for temporary password
          this.toastService.showWarning(
            'Password Change Required',
            'You must change your temporary password before continuing.'
          );
          
          // Navigate immediately after showing the toast
          this.router.navigate(['/set-password'], { queryParams: { token: res.token } });

        } else if (res.token) {
          // Normal, successful login
          this.service.savetoken(res.token);
          
          this.toastService.showSuccess(
            'Login Successful!',
            'Welcome back! Redirecting to your dashboard...'
          );
          
          setTimeout(() => {
            this.router.navigateByUrl("/dashboard");
          }, 1500); // Keep delay so user can see the success toast

        } else {
          // Unexpected response from the backend
          this.toastService.showError(
            'Login Error',
            'An unexpected login error occurred. Please try again.'
          );
        }
        // --- END OF UPDATED LOGIC ---
      },
      error: (err) => {
        // Error handling for failed API calls
        if (err.status === 400) {
          this.toastService.showError('Login Failed', 'Invalid username or password.');
        } else {
          this.toastService.showError('System Error', 'Something went wrong. Please try again later.');
        }
      },
    });
  }
}


  toggleMenu(): void {
    console.log("Hamburger menu clicked!")
    this.menuOpen = !this.menuOpen
  }

  exploreClick() {
    this.router.navigateByUrl("/about-us")
  }
}

import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../../header/header.component"
import { FooterComponent } from "../../footer/footer.component"
import {  AbstractControl, FormBuilder, type ValidatorFn, Validators } from "@angular/forms"
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
  form: any
  isSubmitted = false
  menuOpen = false

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
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        mobile: ["", Validators.required],
        password: [
          "",
          [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[0-9])(?=.*[!@#$%^&*])/)],
        ],
        confirmPassword: [""],
        role: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    // Only check login status in browser environment
    if (typeof window !== "undefined" && this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/dashboard")
    }
  }

  onSubmit() {
    this.isSubmitted = true
    if (this.form.valid) {
      this.authService.createUser(this.form.value).subscribe({
        next: (response: any) => {
          if (response.succeeded) {
            console.log("User registered successfully", response)
            this.form.reset()
            this.isSubmitted = false
          }
          console.log(response)
        },
        error: (error) => {
          console.error("Error registering user", error)
        },
      })
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
}

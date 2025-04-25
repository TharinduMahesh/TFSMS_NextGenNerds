import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../../header/header.component"
import { FooterComponent } from "../../footer/footer.component"
import {  FormBuilder, Validators } from "@angular/forms"
import  { AuthService } from "../../../shared/services/auth.service"
import  { Router } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  form: any
  isSubmitted = false
  menuOpen = false

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      rememberMe: [false],
    })
  }

  ngOnInit(): void {
    // Only check login status in browser environment
    if (typeof window !== "undefined" && this.service.isLoggedIn()) {
      this.router.navigateByUrl("/dashboard")
    }
  }

  hasDisplayError(controlName: string): boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  onSubmit() {
    this.isSubmitted = true

    if (this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res: any) => {
          this.service.savetoken(res.token)
          this.router.navigateByUrl("/dashboard")
        },
        error: (err) => {
          if (err.status == 400) {
            alert("Invalid username or password")
          } else {
            alert("Something went wrong")
          }
        },
      })
    }
  }

  toggleMenu(): void {
    console.log("Hamburger menu clicked!")
    this.menuOpen = !this.menuOpen
  }
}

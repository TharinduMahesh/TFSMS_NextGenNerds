import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { HeaderComponent } from "../header/header.component"
import { FooterComponent } from "../footer/footer.component"
import  { Router } from "@angular/router"
import  { AuthService } from "../../shared/Services/auth.service"
import  { UserService } from "../../shared/Services/user.service"

@Component({
  selector: "app-success",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.css"],
})
export class SuccessComponent implements OnInit {
  firstName = ""
  lastName = ""
  isLoading = true
  error: string | null = null

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl("/sign-in")
      return
    }
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        this.firstName = res.firstName || ""
        this.lastName = res.lastName || ""
        this.isLoading = false
      },
      error: (err: any) => {
        console.log("Error while retrieving user profile:\n", err)
        this.error = "Unable to load your profile. Please try again later."
        this.isLoading = false
      },
    })
  }

  onLogout() {
    this.authService.deletetoken()
    this.router.navigateByUrl("/sign-in")
  }

  navigateToDashboard() {
    this.router.navigateByUrl("/dashboard")
  }

  menuOpen = false
  toggleMenu(): void {
    console.log("Hamburger menu clicked!")
    this.menuOpen = !this.menuOpen
  }
}

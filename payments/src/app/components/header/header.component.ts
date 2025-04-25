import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import  { AuthService } from "../../shared/services/auth.service"
import  { UserService } from "../../shared/services/user.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  menuOpen = false
  firstName = ""
  isLoading = false

  constructor(
    public authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoading = true
      this.userService.getUserProfile().subscribe({
        next: (res: any) => {
          this.firstName = res.firstName || ""
          this.isLoading = false
        },
        error: (err) => {
          console.error("Error loading user profile:", err)
          this.isLoading = false
        },
      })
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen
  }

  logout() {
    this.authService.deletetoken()
    this.firstName = ""
    window.location.href = "/home"
  }
}

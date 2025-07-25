import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule,  Router } from "@angular/router" // Import Router
import  { AuthService } from "../../shared/services/auth.service"
import  { UserService } from "../../shared/services/user.service"
import  { ElementRef, HostListener } from "@angular/core"

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


    profileMenuOpen = false;


  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private elementRef : ElementRef // Inject Router
  ) {}


   @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Check if the click was outside the profile menu container
    if (!this.elementRef.nativeElement.querySelector('.profile-menu-container')?.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }

  ngOnInit(): void {
    this.loadUserProfile()
  }

  loadUserProfile(): void {
      this.isLoading = true;
      this.userService.getUserProfile().subscribe({
        next: (res: any) => {
          this.firstName = res.firstName || "";
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error loading user profile:", err);
          this.isLoading = false;
        },
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen
  }

   toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // NEW: Method to explicitly close the dropdown (e.g., after navigation)
  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  logout() {
    this.authService.deletetoken();
    this.firstName = "";
    this.profileMenuOpen = false; // Close the dropdown on logout
    this.router.navigateByUrl("/home");
  }



}

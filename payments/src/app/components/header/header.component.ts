import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../shared/services/auth.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  menuOpen = false

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen
  }

  logout() {
    this.authService.deletetoken()
    window.location.href = "/home"
  }
}

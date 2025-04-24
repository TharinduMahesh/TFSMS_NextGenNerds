import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(private router: Router,
    private authService: AuthService) { }


  onLogout() {
    this.authService.deletetoken();
    this.router.navigateByUrl('/sign-in');
  } 
}

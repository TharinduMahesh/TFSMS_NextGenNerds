import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
// import { HideIfClaimsNotMetDirective } from '../../shared/directives/hide-if-claims-not-met.directive';
// import { claimReq } from '../../shared/claimReq';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-success',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {

  constructor(private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }
  FirstName: string = '';
  // claimReq = claimReq

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => this.FirstName = res.name,
      error: (err:any) => console.log('error while retriving user profile:\n' + err)
    });
  }

   onLogout() {
    this.authService.deletetoken();
    this.router.navigateByUrl('/login');
   }

  menuOpen = false;

  toggleMenu(): void {
    console.log("Hamburger menu clicked!");
    this.menuOpen = !this.menuOpen;
  }

       }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-sign-in',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   template: `
//     <div class="auth-container">
//       <div class="auth-content">
//         <div class="left-content">
//           <h1>Welcome to our community</h1>
//           <p>Start your new journey with us and join our community</p>
//           <button class="explore-btn">Explore our community</button>
//         </div>
//         <div class="right-content">
//           <div class="auth-form">
//             <h2>Sign In</h2>
//             <form (ngSubmit)="onSubmit()">
//               <div class="form-group">
//                 <input type="text" [(ngModel)]="username" name="username" placeholder="Enter your user name" />
//               </div>
//               <div class="form-group">
//                 <input type="password" [(ngModel)]="password" name="password" placeholder="Password" />
//                 <div class="password-options">
//                   <label>
//                     <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
//                     Remember me
//                   </label>
//                   <a href="#">Forgot Password?</a>
//                 </div>
//               </div>
//               <button type="submit" class="sign-in-btn">SIGN IN</button>
//             </form>
//             <div class="divider">
//               <span>Or connect with</span>
//             </div>
//             <div class="social-buttons">
//               <button class="google-btn">
//                 <img src="assets/google-icon.png" alt="Google" />
//               </button>
//               <button class="facebook-btn">
//                 <img src="assets/facebook-icon.png" alt="Facebook" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styleUrls: ['./sign-in.component.css']
// })
// export class SignInComponent {
//   username: string = '';
//   password: string = '';
//   rememberMe: boolean = false;

//   onSubmit() {
//     console.log('Sign in attempt', { username: this.username, password: this.password });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent,FooterComponent],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  onSubmit() {
    console.log('Sign in attempt', { username: this.username, password: this.password });
  }

 
  menuOpen = false;

  toggleMenu(): void {
    console.log("Hamburger menu clicked!");
    this.menuOpen = !this.menuOpen;
  }
  
  
}
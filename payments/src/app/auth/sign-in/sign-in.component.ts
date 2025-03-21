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

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="logo">
          <img src="https://c7.alamy.com/comp/2J3BD6R/green-water-wave-splash-with-tea-leaves-realistic-vector-herbal-tea-drink-flow-or-matcha-swirl-with-ripple-texture-falling-drops-and-droplets-cold-green-tea-beverage-flavored-with-fresh-mint-leaves-2J3BD6R.jpg" alt="Arunatea Logo" />
        </div>
        <div class="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Help</a>
          <a href="#">Contact</a>
          <a href="/sign-in" class="sign-in">Sign in</a>
          <a href="/sign-up" class="register">Register</a>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="auth-container">
        <div class="auth-content">
          <div class="left-content">
            <h1>Welcome to our community</h1>
            <p>Start your new journey with us and join our community</p>
            <button class="explore-btn">Explore our community</button>
            <img src="https://c7.alamy.com/comp/2J3BD6R/green-water-wave-splash-with-tea-leaves-realistic-vector-herbal-tea-drink-flow-or-matcha-swirl-with-ripple-texture-falling-drops-and-droplets-cold-green-tea-beverage-flavored-with-fresh-mint-leaves-2J3BD6R.jpg" alt="Tea Leaf" class="tea-leaf" />
          </div>
          <div class="right-content">
            <div class="auth-form">
              <div class="form-group">
                <input type="text" [(ngModel)]="username" name="username" placeholder="Enter your user name" />
              </div>
              <div class="form-group">
                <input type="password" [(ngModel)]="password" name="password" placeholder="Password" />
                <div class="password-options">
                  <label>
                    <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
                    Remember me
                  </label>
                  <a href="#">Forgot Password?</a>
                </div>
              </div>
              <button type="submit" class="sign-in-btn" (click)="onSubmit()">SIGN IN</button>
              <div class="divider">
                <span>Or connect with</span>
              </div>
              <div class="social-buttons">
                <button class="google-btn">
                  <img src="assets/google-icon.png" alt="Google" />
                </button>
                <button class="facebook-btn">
                  <img src="assets/facebook-icon.png" alt="Facebook" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Reach us</h3>
            <p>+94 342294110</p>
            <p>arunateamarunatea.lk</p>
            <p>
              Aruna Tea Factory (Pvt) Ltd<br>
              Kumbaduwaa Estate,<br>
              Kumbaduwaa,<br>
              Meegahathanna,<br>
              Sri Lanka
            </p>
          </div>
          <div class="footer-section">
            <h3>Company</h3>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Blogs</a>
          </div>
          <div class="footer-section">
            <h3>Legal</h3>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Services</a>
            <a href="#">Terms of Use</a>
            <a href="#">Refund Policy</a>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <a href="#">Techlabz Keybox</a>
            <a href="#">Downloads</a>
            <a href="#">Forum</a>
          </div>
          <div class="footer-section">
            <h3>Join Our Newsletter</h3>
            <div class="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button>Subscribe</button>
            </div>
            <p>* Will send you weekly updates for your better tool management.</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>©2024 Copyright:www.Arunatea.com</p>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  onSubmit() {
    console.log('Sign in attempt', { username: this.username, password: this.password });
  }
}
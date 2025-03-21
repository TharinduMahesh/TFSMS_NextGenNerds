import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <div class="left-content">
          <img src="assets/tea-splash.png" alt="Tea Splash" class="tea-splash" />
        </div>
        <div class="right-content">
          <div class="auth-form">
            <h2>Sign Up</h2>
            <form (ngSubmit)="onSubmit()">
              <div class="form-row">
                <div class="form-group">
                  <label>First Name:</label>
                  <input type="text" [(ngModel)]="firstName" name="firstName" placeholder="Enter your name" />
                </div>
                <div class="form-group">
                  <label>Last Name:</label>
                  <input type="text" [(ngModel)]="lastName" name="lastName" placeholder="Enter your name" />
                </div>
              </div>
              <div class="form-group">
                <label>Email Id:</label>
                <input type="email" [(ngModel)]="email" name="email" placeholder="info@xyz.com" />
              </div>
              <div class="form-group">
                <label>Mobile No.:</label>
                <input type="tel" [(ngModel)]="mobile" name="mobile" placeholder="+91 - 98956 69500" />
              </div>
              <div class="form-group">
                <label>Password:</label>
                <input type="password" [(ngModel)]="password" name="password" placeholder="xxxxxxxx" />
              </div>
              <div class="form-group">
                <label>Confirm Password:</label>
                <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="xxxxxxxx" />
              </div>
              <div class="form-group">
                <label>Role:</label>
                <select [(ngModel)]="role" name="role">
                  <option value="">Enter company role...</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button type="submit" class="sign-up-btn">SIGN UP</button>
            </form>
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
  `,
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  mobile: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';

  onSubmit() {
    console.log('Sign up attempt', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobile: this.mobile,
      role: this.role
    });
  }
}
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-sign-up',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './sign-up.component.html',
//   styleUrls: ['./sign-up.component.css']
// })
// export class SignUpComponent {
//   firstName: string = '';
//   lastName: string = '';
//   email: string = '';
//   mobile: string = '';
//   password: string = '';
//   confirmPassword: string = '';
//   role: string = '';

//   onSubmit() {
//     console.log('Sign up attempt', {
//       firstName: this.firstName,
//       lastName: this.lastName,
//       email: this.email,
//       mobile: this.mobile,
//       role: this.role
//     });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
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
    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    
    console.log('Sign up attempt', { 
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobile: this.mobile,
      role: this.role
    });
  }

  menuOpen = false;

  toggleMenu(): void {
    console.log("Hamburger menu clicked!");
    this.menuOpen = !this.menuOpen;
  }
}
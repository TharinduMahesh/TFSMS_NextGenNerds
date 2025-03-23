// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { Component, OnInit, HostListener } from '@angular/core';


// @Component({
//   selector: 'app-home',
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css'
// })

// export class HomeComponent implements OnInit {
         
//     menuOpen = false;
  
//     toggleMenu(): void {
//       console.log("Hamburger menu clicked!");
//       this.menuOpen = !this.menuOpen;
//     }
// }
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import{ FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule ,RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menuOpen = false;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollToContent(): void {
    // Scroll to content section when the scroll indicator is clicked
    const contentSection = document.querySelector('.hero-description');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  subscribeToNewsletter(email: string): void {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    // Here you would typically call a service to handle the subscription
    console.log('Subscribing email:', email);
    alert(`Thank you for subscribing with ${email}!`);
    
    // Clear the input field
    const inputElement = document.querySelector('.newsletter-form input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // You can add scroll effects here if needed
    // For example, changing navbar background on scroll
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }
    }
  }
}
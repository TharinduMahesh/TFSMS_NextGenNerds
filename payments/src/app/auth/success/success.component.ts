import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-success',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {

  menuOpen = false;

  toggleMenu(): void {
    console.log("Hamburger menu clicked!");
    this.menuOpen = !this.menuOpen;
  }

       }

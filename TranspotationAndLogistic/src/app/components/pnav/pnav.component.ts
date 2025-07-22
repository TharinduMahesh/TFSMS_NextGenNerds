
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // For navigation

@Component({
  selector: 'app-pnavbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Import necessary modules
  templateUrl: './pnav.component.html',
  styleUrls: ['./pnav.component.scss']
})
export class PNavbarComponent {
  
}
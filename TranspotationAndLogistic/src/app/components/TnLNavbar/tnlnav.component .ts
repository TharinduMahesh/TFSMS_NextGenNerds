
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // For navigation

@Component({
  selector: 'app-tnlnavbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Import necessary modules
  templateUrl: './tnlnav.component.html',
  styleUrls: ['./tnlnav.component.scss']
})
export class TnLNavbarComponent {
  
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // For navigation

@Component({
  selector: 'app-tnlnavbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Import necessary modules
  templateUrl: './tnLnav.component.html',
  styleUrls: ['./tnLnav.component.scss']
})
export class TnLNavbarComponent {
  
}
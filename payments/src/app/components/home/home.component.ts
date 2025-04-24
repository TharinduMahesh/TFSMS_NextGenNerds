import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';


@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  scrollToContent(): void {
    // Scroll down by one viewport height
    window.scrollBy({
      top: window.innerHeight, // Scroll down by one viewport height
      behavior: 'smooth'
    });
  }
}

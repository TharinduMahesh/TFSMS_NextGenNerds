import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar/sidebar.component";

 
//import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tea-packing-ledger';

  navItems = [
    { label: 'Home', route: '/home', active: true },
    { label: 'About', route: '/about', active: false },
    { label: 'Features', route: '/features', active: false },
    { label: 'Help', route: '/help', active: false },
    { label: 'Contact', route: '/contact', active: false }
  ];
}

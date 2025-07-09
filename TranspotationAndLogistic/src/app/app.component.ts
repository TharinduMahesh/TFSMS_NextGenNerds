import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavigationComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, SidebarComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}

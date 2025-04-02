import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/slidebar/slidebar.component';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, SidebarComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'T';
}

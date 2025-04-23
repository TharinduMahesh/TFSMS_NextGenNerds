import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar/sidebar.component";
import { DashboardComponent } from "./components/dashboard/dahsboard/dahsboard.component";
import { TeaPackingLedgerComponent } from './components/reports/tea-packing-and-ledger/tea-packing-and-ledger.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, DashboardComponent, TeaPackingLedgerComponent, HttpClientModule],
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

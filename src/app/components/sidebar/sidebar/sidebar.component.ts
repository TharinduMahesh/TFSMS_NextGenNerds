import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

interface RouteTitleMap {
  [key: string]: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = false; // For dropdown toggle
  currentUrl = '';
  currentPageTitle = ''; // Default title

  routeTitleMap: RouteTitleMap = {
    '/dashboard': 'Dashboard',
    '/suppliers': 'Suppliers',
    '/collector': 'Collector',
    '/ledger-management': 'Ledger Management',
    '/green-leaf-collection-entry': 'Green Leaf Collection',
    '/process-management': 'Process Management',
    '/payment': 'Payment',
    '/report': 'Reports',
    '/report/dashboard': 'Report Dashboard',
    '/report/green-': 'Tea Packing and Ledger',
    '/report/claims-and-returns': 'Claims and Returns',
    '/report/sales': 'Sales Reports',
    '/report/sales/Financial-Reports/farmer-loan-report': 'Loan Details',
    '/report/monthly-nsa': 'Monthly NSA'
  };

  //Responsivity
  sidebarOpen = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => { //change is made if try to undo IT IS HERE
      this.currentUrl = event.url;
      this.updatePageTitle(this.currentUrl);
      this.cdRef.detectChanges();
    });

    this.updatePageTitle(this.router.url);
  }

  updatePageTitle(url: string) {
    let foundTitle = false;

    if (this.routeTitleMap[url]) {
      this.currentPageTitle = this.routeTitleMap[url];
      foundTitle = true;
    } else {
      for (const route in this.routeTitleMap) {
        if (url.startsWith(route) && route !== '/') {
          this.currentPageTitle = this.routeTitleMap[route];
          foundTitle = true;
          break;
        }
      }
    }

    if (!foundTitle) {
      this.currentPageTitle = 'Title error';
    }

    this.titleService.setTitle(this.currentPageTitle);
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.cdRef.detectChanges();
  }

  // navigateTo(route: string) {
  //   const fullRoute = `/report/${route}`;
  //   this.router.navigate([fullRoute]);
  //   this.updatePageTitle(fullRoute);
  // }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.dropdown')) {
      this.isOpen = false;
      this.cdRef.detectChanges();
    }
  }

  logout() {
    console.log('Logout clicked');
    //logout logic here
  }
}

import { Component, HostListener, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RouteTitleMap {
  [key: string]: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  isOpen = false;
  sidebarOpen = false; // Changed default to false for better mobile experience
  isMobile = false;
  currentUrl = '';
  currentPageTitle = '';

  routeTitleMap: RouteTitleMap = {
    '/dashboard': 'Dashboard',
    '/suppliers': 'Suppliers',
    '/collector': 'Collector',
    '/ledger-management': 'Ledger Management',
    '/green-leaf-collection': 'Green Leaf Collection',
    '/process-management': 'Process Management',
    '/payment': 'Payment',
    '/report': 'Reports',
    '/report/green-leaf-collection-report': 'Green Leaf Collection Report',
    '/report/claims-and-returns': 'Claims and Returns',
    '/report/sales': 'Sales Reports',
    '/report/monthly-nsa': 'Monthly NSA'
  };

  constructor(
    private router: Router,
    private titleService: Title,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.updatePageTitle(this.currentUrl);
      
      // Auto-close sidebar on mobile after navigation
      if (this.isMobile) {
        this.sidebarOpen = false;
      }
      
      // Auto-close dropdown after navigation
      this.isOpen = false;
      
      this.cdRef.detectChanges();
    });
  }

  ngOnInit() {
    this.checkScreenSize();
    this.updatePageTitle(this.router.url);
  }

  @HostListener('window:resize')
  checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 900;
    
    // Handle sidebar state when switching between mobile/desktop
    if (wasMobile && !this.isMobile) {
      // Switched from mobile to desktop
      this.sidebarOpen = true;
    } else if (!wasMobile && this.isMobile) {
      // Switched from desktop to mobile
      this.sidebarOpen = false;
    }
    
    this.cdRef.detectChanges();
  }

  updatePageTitle(url: string) {
    let foundTitle = false;

    // Direct match first
    if (this.routeTitleMap[url]) {
      this.currentPageTitle = this.routeTitleMap[url];
      foundTitle = true;
    } else {
      // Partial match for nested routes
      for (const route in this.routeTitleMap) {
        if (url.startsWith(route) && route !== '/') {
          this.currentPageTitle = this.routeTitleMap[route];
          foundTitle = true;
          break;
        }
      }
    }

    if (!foundTitle) {
      this.currentPageTitle = 'Tea Factory Management System';
    }

    this.titleService.setTitle(this.currentPageTitle);
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.cdRef.detectChanges();
  }

  // Method to manually close dropdown (used in template)
  closeDropdown() {
    this.isOpen = false;
    this.cdRef.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    
    // Close dropdown if clicking outside
    if (!targetElement.closest('.dropdown')) {
      this.isOpen = false;
      this.cdRef.detectChanges();
    }
    
    // Close sidebar on mobile if clicking outside
    if (this.isMobile && this.sidebarOpen) {
      if (!targetElement.closest('.sidebar') && !targetElement.closest('.sidebar-toggle')) {
        this.sidebarOpen = false;
        this.cdRef.detectChanges();
      }
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    // Close dropdown on ESC key
    if (this.isOpen) {
      this.isOpen = false;
      this.cdRef.detectChanges();
    }
    
    // Close sidebar on mobile on ESC key
    if (this.isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
      this.cdRef.detectChanges();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdRef.detectChanges();
  }

  // Method to close sidebar (useful for mobile navigation)
  closeSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = false;
      this.cdRef.detectChanges();
    }
  }

  // Navigate and close mobile sidebar
  navigateAndClose(route: string) {
    this.router.navigate([route]);
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
    this.cdRef.detectChanges();
  }

  logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data here
      // localStorage.removeItem('authToken');
      // sessionStorage.clear();
      
      // Navigate to login page
      this.router.navigate(['/login']);
      
      // Close sidebar on mobile
      if (this.isMobile) {
        this.sidebarOpen = false;
      }
      
      this.cdRef.detectChanges();
    }
  }

  // Check if current route matches the given route
  isRouteActive(route: string): boolean {
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }

  // Check if any report route is active
  isReportsActive(): boolean {
    return this.currentUrl.startsWith('/report');
  }
}
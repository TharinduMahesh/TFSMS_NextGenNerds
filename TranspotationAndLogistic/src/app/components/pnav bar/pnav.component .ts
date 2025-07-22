import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule might not be needed if not using ngIf etc.
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-pnavbar', // Or your actual selector e.g., 'app-pnavbar'
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './pnav.component.html',
  styleUrls: ['./pnav.component.scss']
})
export class PNavbarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;
  
  // This signal controls the visibility of the dropdown menu
  isDropdownOpen = signal(false);
  
  // This signal holds the text for the dropdown toggle
  dropdownLabel = signal("More");

  // These are the routes that belong to the dropdown
  private readonly dropdownRoutes: { path: string; label: string }[] = [
    // Ensure these paths match your app.routes.ts exactly
    { path: '/performancedashboard/costs-report', label: 'Collector Cost' },
    { path: '/performancedashboard/cost-analysis', label: 'Cost Analysis' }
  ];

  // This computed signal determines if the "More" link should be highlighted
  isDropdownActive = computed(() => {
    return this.dropdownRoutes.some(route => this.router.isActive(route.path, false));
  });

  ngOnInit(): void {
    // This logic updates the label when the route changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateDropdownLabel(event.urlAfterRedirects);
    });
    // Check initial URL
    this.updateDropdownLabel(this.router.url);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
  
  private updateDropdownLabel(currentUrl: string): void {
    const activeDropdownRoute = this.dropdownRoutes.find(route => currentUrl.startsWith(route.path));
    if (activeDropdownRoute) {
      this.dropdownLabel.set(activeDropdownRoute.label);
    } else {
      this.dropdownLabel.set("More");
    }
  }
  toggleDropdown(): void {
    this.isDropdownOpen.update(currentValue => !currentValue);
  }
}
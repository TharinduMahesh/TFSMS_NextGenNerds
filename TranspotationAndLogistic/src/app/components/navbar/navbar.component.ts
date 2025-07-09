import { Component, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavigationComponent implements AfterViewInit {
  private activeLinkId = 'nav-home';

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Add click listeners for navigation links
    const navLinks = ['nav-home', 'nav-about', 'nav-features', 'nav-help', 'nav-contact'];

    navLinks.forEach(linkId => {
      const element = document.getElementById(linkId);
      if (element) {
        this.renderer.listen(element, 'click', (event) => {
          event.preventDefault();
          this.setActiveLink(linkId);
        });
      }
    });

    // Search button click
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchBtn && searchInput) {
      this.renderer.listen(searchBtn, 'click', () => {
        this.onSearch(searchInput.value);
      });

      // Handle Enter key on input
      this.renderer.listen(searchInput, 'keyup', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.onSearch(searchInput.value);
        }
      });
    }

    // Notification button click
    const notifBtn = document.getElementById('notif-btn');
    if (notifBtn) {
      this.renderer.listen(notifBtn, 'click', () => {
        this.onNotifications();
      });
    }
  }

  setActiveLink(linkId: string): void {
    // Remove active class from old link
    const oldActive = document.getElementById(this.activeLinkId);
    if (oldActive) {
      this.renderer.removeClass(oldActive, 'active');
    }

    // Add active class to new link
    const newActive = document.getElementById(linkId);
    if (newActive) {
      this.renderer.addClass(newActive, 'active');
      this.activeLinkId = linkId;
    }
  }

  onSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      console.log('Searching for:', trimmedQuery);
      // Implement your search logic here
    }
  }

  onNotifications(): void {
    console.log('Notifications clicked');
    // Implement your notification logic here
  }
}

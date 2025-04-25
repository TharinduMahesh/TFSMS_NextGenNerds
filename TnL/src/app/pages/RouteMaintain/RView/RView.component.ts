import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { RviewService } from '../../../services/RoutePlanning';
import { Rview } from '../../../models/rview.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-rview',
  standalone: true,
  templateUrl: './RView.component.html', 
  styleUrls: ['./RView.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RViewComponent implements OnInit {
  searchTerm = signal('');
  selectedFilter = signal('all');
  routes = signal<Rview[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  filteredRoutes = computed(() => {
    return this.routes().filter(route => {
      const searchTerm = this.searchTerm().toLowerCase();
      const matchesSearch =
        route.id?.toString().includes(searchTerm) ||
        route.startLocation?.toLowerCase().includes(searchTerm) ||
        route.endLocation?.toLowerCase().includes(searchTerm) ||
        searchTerm === '';

      const distanceValue = this.parseDistance(route.distance);
      let matchesFilter = true;

      switch (this.selectedFilter()) {
        case 'short': matchesFilter = distanceValue < 20; break;
        case 'medium': matchesFilter = distanceValue >= 20 && distanceValue <= 50; break;
        case 'long': matchesFilter = distanceValue > 50; break;
      }

      return matchesSearch && matchesFilter;
    });
  });

  constructor(
    private router: Router,
    private rviewService: RviewService
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  private parseDistance(distance: string | number | undefined): number {
    if (!distance) return 0;
    if (typeof distance === 'number') return distance;
    return parseFloat(distance.toString().replace(/[^\d.-]/g, ''));
  }

  loadRoutes(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.rviewService.getAll().subscribe({
      next: (data) => {
        this.routes.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to load routes');
        this.isLoading.set(false);
      }
    });
  }

  trackById(index: number, item: Rview): number {
    return item.id ?? index;
  }

  addNewRoute(): void {
    this.router.navigate(['/rform']);
  }

  onView(id?: number): void {
    if (id) {
      this.router.navigate(['/routes/view', id]);
    }
  }

  onEdit(id?: number): void {
    if (id) {
      this.router.navigate(['/routes/edit', id]);
    }
  }

  onDelete(id?: number): void {
    if (id && confirm('Are you sure you want to delete this route?')) {
      this.isLoading.set(true);
      this.rviewService.delete(id).subscribe({
        next: () => {
          this.loadRoutes(); // Refresh the list
        },
        error: (err: Error) => {
          this.error.set(err.message || 'Failed to delete route');
          this.isLoading.set(false);
        }
      });
    }
  }
}
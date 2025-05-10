import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Rview } from '../../../models/rview.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RService } from '../../../services/RouteMaintainService/RouteMaintain.service';
import { RtViewComponent } from '../r-view/r-view.component';
import { RtEditComponent } from '../r-edit/r-edit.component';

@Component({
  selector: 'app-rview',
  standalone: true,
  templateUrl: './r-review.component.html', 
  styleUrls: ['./r-review.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, RtViewComponent,RtEditComponent]
})
export class RtReviewComponent implements OnInit {
  searchTerm = signal('');
  selectedFilter = signal('all');
  routes = signal<Rview[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

    isModalOpen = signal(false);   //signals for view
    routeToView = signal<Rview | null>(null);
  
    routeBeingEdited = signal<Rview | null>(null);
    isEditModalOpen = signal(false);
    formModel = signal<Rview | null>(null);
  

  filteredRoutes = computed(() => {
    return this.routes().filter(route => {
      const searchTerm = this.searchTerm().toLowerCase();
      const matchesSearch =
        route.rId?.toString().includes(searchTerm) ||
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
    private rService: RService
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  private parseDistance(distance: string | number | undefined): number {
    if (!distance)
       return 0;
    if (typeof distance === 'number') 
      return distance;
    return parseFloat(distance.toString().replace(/[^\d.-]/g, ''));
  }

  loadRoutes(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.rService.getAll().subscribe({
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


  selectedRoute = signal<Rview | null>(null);
  
  onSelectRoute(route: Rview): void {
    this.selectedRoute.set(route);
  }

  trackById(index: number, item: Rview): number {
    return item.rId ?? index;
  }

  addNewRoute(): void {
    this.router.navigate(['/r-create']);
  }

   //view logic begin
   onView(route: Rview): void {
    this.routeToView.set(route);         // sets the selected route
    this.isModalOpen.set(true);          // opens modal
    console.log('Viewing route:', route.rId);
  }
  
  
  

  closeModal(): void {
    this.isModalOpen.set(false);
    this.routeToView.set(null);
  }
  //view logic end

  //edit logic begin
  onEdit(route: Rview): void {
    this.routeBeingEdited.set(route);
    this.isEditModalOpen.set(true);
  };

  // In your parent component
closeEditModal(): void {
  this.isEditModalOpen.set(false);
  this.routeBeingEdited.set(null);
}

  onSaveEdit(updatedRoute: Rview): void {
    if (!updatedRoute.rId) {
      console.error('Cannot update route without ID');
      return;
    }
  
    this.isLoading.set(true);
    this.rService.update(updatedRoute.rId, updatedRoute).subscribe({
      next: () => {
        this.loadRoutes(); // Refresh the list
        this.closeEditModal();
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to update route');
        this.isLoading.set(false);
      }
    });
  }
  

  onDelete(id?: number): void {
    if (id && confirm('Are you sure you want to delete this route?')) {
      this.isLoading.set(true);
      this.rService.delete(id).subscribe({
        next: () => {
          this.loadRoutes(); // Refresh after deletion
          this.selectedRoute.set(null); // Clear selection
        },
        error: (err: Error) => {
          this.error.set(err.message || 'Failed to delete route');
          this.isLoading.set(false);
        }
      });
    }
  }

}
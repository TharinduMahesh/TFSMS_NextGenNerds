import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteService } from '../../../services/RouteMaintainService/RouteMaintain.service';
import { RtViewComponent } from '../r-view/r-view.component';
import { RtEditComponent } from '../r-edit/r-edit.component';

@Component({
  selector: 'app-RtList',
  standalone: true,
  templateUrl: './r-review.component.html',
  styleUrls: ['./r-review.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, RtViewComponent]
})
export class RtReviewComponent implements OnInit {
  searchTerm = signal('');
  selectedFilter = signal('all');
  routes = signal<RtList[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  selectedRoute = signal<RtList | null>(null);

  //signals for view
  isModalOpen = signal(false);   
  routeToView = signal<RtList | null>(null);

  //signal for edit
  routeBeingEdited = signal<RtList | null>(null);
  isEditModalOpen = signal(false);
  formModel = signal<RtList | null>(null);


  constructor(
    private router: Router,
    private RouteService: RouteService
  ) { }


  filteredRoutes = computed(() => {
    return this.routes().filter(route => {
      const searchTerm = this.searchTerm().toLowerCase();
      const matchesSearch =
        route.rName.toLowerCase().includes(searchTerm) ||
        route.rId?.toString().includes(searchTerm) ||
        // route.startLocation?.toLowerCase().includes(searchTerm) ||
        // route.endLocation?.toLowerCase().includes(searchTerm) ||
        searchTerm === '';

      const distanceValue = route.distance;
      let matchesFilter = true;

      switch (this.selectedFilter()) {
        case 'short': matchesFilter = distanceValue < 20; break;
        case 'medium': matchesFilter = distanceValue >= 20 && distanceValue <= 50; break;
        case 'long': matchesFilter = distanceValue > 50; break;
      }

      return matchesSearch && matchesFilter;
    });
  });

  
  //load the routes
  ngOnInit(): void {
    this.loadRoutes();
  }


  loadRoutes(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.RouteService.getAllRoutes().subscribe({
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




  onSelectRoute(route: RtList): void {
    this.selectedRoute.set(route);
  }

  trackById(index: number, item: RtList): number {
    return item.rId ?? index;
  }

  addNewRoute(): void {
    this.router.navigate(['/r-create']);
  }

  //view logic begin
  onView(route: RtList): void {
    this.routeToView.set(route);        
    this.isModalOpen.set(true);        
    console.log('Viewing route:', route.rId);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.routeToView.set(null);
  }
  //view logic end


  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.routeBeingEdited.set(null);
  }

  onEdit(route: RtList): void {
    this.router.navigate(['/r-edit', route.rId]);
  }

  onSaveEdit(updatedRoute: RtList): void {
    if (!updatedRoute.rId) {
      console.error('Cannot update route without ID');
      return;
    }

    this.isLoading.set(true);
    this.RouteService.updateRoute(updatedRoute.rId, updatedRoute).subscribe({
      next: () => {
        this.loadRoutes(); 
        this.closeEditModal();
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to update route');
        this.isLoading.set(false);
      }
    });
  }


    //delete logic for the route

  onDelete(id?: number): void {
    if (id && confirm('Are you sure you want to delete this route?')) {
      this.isLoading.set(true);
      this.RouteService.delete(id).subscribe({
        next: () => {
          this.loadRoutes(); 
          this.selectedRoute.set(null); 
        },
        error: (err: Error) => {
          this.error.set(err.message || 'Failed to delete route');
          this.isLoading.set(false);
        }
      });
    }
  }

}
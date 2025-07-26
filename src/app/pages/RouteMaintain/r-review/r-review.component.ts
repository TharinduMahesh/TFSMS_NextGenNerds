import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { RtList, CreateUpdateRoutePayload } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';

import { RtViewComponent } from '../r-view/r-view.component';
import { TnLNavbarComponent } from "../../../components/TnLNavbar/tnlnav.component";
import { RtEditComponent } from "../r-edit/r-edit.component";

@Component({
  selector: 'app-r-review',
  standalone: true,
  imports: [CommonModule, RtViewComponent, TnLNavbarComponent, RtEditComponent],
  templateUrl: './r-review.component.html',
  styleUrls: ['./r-review.component.scss']
})
export class RtReviewComponent implements OnInit {
  // --- Injected Services ---
  private router = inject(Router);
  private routeService = inject(RouteService);

  // --- State Signals ---
  private allRoutes = signal<RtList[]>([]);
  searchTerm = signal('');
  selectedFilter = signal('all');
  isLoading = signal(true);
  error = signal<string | null>(null);

  // --- Modal State Signals ---
  selectedRoute = signal<RtList | null>(null); // For highlighting a row
  isViewModalOpen = signal(false);
  routeToView = signal<RtList | null>(null);

  isEditModalOpen = signal(false);
  // *** CORRECTED ***: Renamed 'routeBeingEdited' to 'routeToEdit' for consistency with the template
  routeToEdit = signal<RtList | null>(null);

  // --- Computed Signal for Displaying Data ---
  filteredRoutes = computed(() => {
    const routes = this.allRoutes();
    const term = this.searchTerm().toLowerCase();
    const filter = this.selectedFilter();

    return routes.filter(route => {
      const matchesSearch = term === '' ||
        route.rName.toLowerCase().includes(term) ||
        route.rId.toString().includes(term);

      const distance = route.distance ?? 0;
      let matchesFilter = true;
      if (filter === 'short') matchesFilter = distance < 20;
      else if (filter === 'medium') matchesFilter = distance >= 20 && distance <= 50;
      else if (filter === 'long') matchesFilter = distance > 50;

      return matchesSearch && matchesFilter;
    });
  });

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.routeService.getAllRoutes().subscribe({
      next: (data) => {
        this.allRoutes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(`Failed to load routes: ${err.message}`);
        this.isLoading.set(false);
      }
    });
  }

  trackById(index: number, item: RtList): number {
    return item.rId;
  }

  onSelectRoute(route: RtList): void {
    this.selectedRoute.set(route);
  }

  addNewRoute(): void {
    this.router.navigate(['transportdashboard/r-create']);
  }

  onView(route: RtList): void {
    this.routeToView.set(route);
    this.isViewModalOpen.set(true);
  }

  // *** CORRECTED ***: This method now opens the modal instead of navigating
  onEdit(route: RtList): void {
    this.routeToEdit.set(route);
    this.isEditModalOpen.set(true);
  }

  onDelete(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this route?')) {
      this.routeService.delete(id).subscribe({
        next: () => {
          this.loadRoutes();
          alert('Route deleted successfully.');
        },
        error: (err) => alert(`Error deleting route: ${err.message}`)
      });
    }
  }

  // --- Event handlers for the Modals ---

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.routeToView.set(null);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.routeToEdit.set(null);
  }

  // This handles the (save) event from the edit component
  handleSave(payload: CreateUpdateRoutePayload): void {
    const routeToUpdate = this.routeToEdit();
    if (!routeToUpdate) return;

    this.routeService.updateRoute(routeToUpdate.rId, payload).subscribe({
      next: () => {
        this.loadRoutes();
        this.closeEditModal();
        alert('Route updated successfully!');
      },
      error: (err) => alert(`Error updating route: ${err.message}`)
    });
  }
}
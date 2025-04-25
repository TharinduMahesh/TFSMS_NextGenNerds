// src/app/components/rytrack/rytrack.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { RytrackService } from '../../../services/YieldDetails/YieldDetails.service';
import { YieldList } from '../../../models/rview.model';
import { RYViewComponent } from '../ryView/ryView.component';
import { RyeditComponent } from '../ryEdit/ryedit.component';

@Component({
  selector: 'app-rytrack',
  standalone: true,
  templateUrl: './ryReview.component.html',
  styleUrls: ['./ryReview.component.scss'],
  imports:[RYViewComponent]
})
export class RytrackComponent implements OnInit {
  searchTerm = signal('');
  selectedFilter = signal('all');
  yieldLists = signal<YieldList[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  isModalOpen = signal(false);   //signals for view
  routeToView = signal<YieldList | null>(null);

  routeToEdit = signal<YieldList | null>(null);  //signals for edit 
  isEditModalOpen = signal(false);
  formModel = signal<YieldList | null>(null);




  filteredYieldLists = computed(() => {
    return this.yieldLists().filter(yieldList => {
      const searchTerm = this.searchTerm().toLowerCase();
      const matchesSearch =
        yieldList.routeId?.toString().includes(searchTerm) ||
        yieldList.routeName?.toLowerCase().includes(searchTerm) ||
        yieldList.collectorID?.toString().includes(searchTerm) ||
        yieldList.vehicalID?.toString().includes(searchTerm) ||
        yieldList.collected_Yield?.toString().includes(searchTerm) ||
        searchTerm === '';

      let matchesFilter = true;

      return matchesSearch && matchesFilter;
    });
  });
  yieldListService: any;

  constructor(private rytrackService: RytrackService) { }

  ngOnInit(): void {
    this.fetchYieldLists();
  }

  fetchYieldLists(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.rytrackService.getAllYieldLists().subscribe({
      next: (data) => {
        this.yieldLists.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to load yield lists');
        this.isLoading.set(false);
      }
    });
  }

  trackById(index: number, item: YieldList): number {
    return item.routeId ?? index;
  }

  addNewRoute(): void {

  }

  selectedRoute = signal<YieldList | null>(null);

  onSelectRoute(route: YieldList): void {
    this.selectedRoute.set(route);
  }

  //view logic begin
  onView(): void {
    const route = this.selectedRoute();
    if (route?.routeId) {
        this.routeToView.set(route);
        this.isModalOpen.set(true);
        console.log('Viewing route:', route.routeId);
    }

  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.routeToView.set(null);
  }
  //view logic end

  //edit logic begin
  onEdit(): void {
    const route = this.selectedRoute();
    if (route) {
      this.formModel.set(route); // <- make sure to set this
      this.isEditModalOpen.set(true);
    }
  }
  
  
  //edit end
  

  deleteYield(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.rytrackService.deleteYieldList(id).subscribe({
        next: () => {
          this.yieldLists.set(this.yieldLists().filter(y => y.routeId !== id));
        },
        error: (err: Error) => {
          this.error.set(err.message || 'Failed to delete the yield list');
        }
      });
    }

  }



}

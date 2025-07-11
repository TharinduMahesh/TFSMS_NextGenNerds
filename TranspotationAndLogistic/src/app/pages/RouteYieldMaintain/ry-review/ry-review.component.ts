import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RyService } from '../../../services/RouteYieldMaintainService/RouteYieldMaintain.service';
import { YieldResponse } from '../../../models/RouteYeildMaintain.model'; // Corrected model path
import { RyEditComponent } from '../ry-edit/ry-edit.component';
import { RyViewComponent } from '../ry-view/ry-view.component';

@Component({
  selector: 'app-rytrack',
  standalone: true,
  templateUrl: './ry-review.component.html',
  styleUrls: ['./ry-review.component.scss'],
  imports: [CommonModule, RyViewComponent, RyEditComponent]
})
export class RyReviewComponent implements OnInit {
  searchTerm = signal('');
  yieldLists = signal<YieldResponse[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  isViewModalOpen = signal(false);
  routeToView = signal<YieldResponse | null>(null);

  isEditModalOpen = signal(false);
  routeToEdit = signal<YieldResponse | null>(null);

  constructor(private ryService: RyService, private router: Router) { }

  filteredYieldLists = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.yieldLists();
    return this.yieldLists().filter(yieldList =>
      yieldList.rName?.toLowerCase().includes(term) ||
      yieldList.collected_Yield.toString().includes(term) ||
      yieldList.yId.toString().includes(term)
    );
  });

  ngOnInit(): void {
    this.fetchYieldLists();
  }

  fetchYieldLists(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.ryService.getAllYieldLists().subscribe({
      next: (data) => this.yieldLists.set(data),
      error: (err: Error) => this.error.set(err.message || 'Failed to load'),
      complete: () => this.isLoading.set(false)
    });
  }

  trackById(index: number, item: YieldResponse): number {
    return item.yId;
  }

  addNewRoute(): void {
    this.router.navigate(['/ry-create']);
  }

  onView(route: YieldResponse): void {
    this.routeToView.set(route);
    this.isViewModalOpen.set(true);
  }

  onEdit(route: YieldResponse): void {
    this.routeToEdit.set(route);
    this.isEditModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
  }

  closeEditModal(refresh: boolean): void {
    this.isEditModalOpen.set(false);
    if (refresh) {
      this.fetchYieldLists();
    }
  }

  onDelete(yieldId: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.ryService.deleteYieldList(yieldId).subscribe({
        next: () => this.yieldLists.update(lists => lists.filter(y => y.yId !== yieldId)),
        error: (err: Error) => this.error.set(err.message || 'Failed to delete')
      });
    }
  }
}
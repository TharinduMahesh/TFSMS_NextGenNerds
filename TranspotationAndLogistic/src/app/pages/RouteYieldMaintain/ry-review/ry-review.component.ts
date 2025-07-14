import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Required models and service
import { YieldResponse } from '../../../models/Logistic and Transport/RouteYeildMaintain.model';
import { RyService } from '../../../services/RouteYieldMaintainService/RouteYieldMaintain.service';

// Child component used in the template
import { RyViewComponent } from '../ry-view/ry-view.component';

@Component({
  selector: 'app-ry-review',
  standalone: true,
  // This 'imports' array now correctly includes the child component
  imports: [CommonModule, RyViewComponent],
  templateUrl: './ry-review.component.html',
  styleUrls: ['./ry-review.component.scss']
})
export class RyReviewComponent implements OnInit {
  // Dependency Injection
  private ryService = inject(RyService);
  private router = inject(Router);

  // --- State Signals ---
  yieldLists = signal<YieldResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  // --- View Modal Management ---
  isViewModalOpen = signal(false);
  dataToView = signal<YieldResponse | null>(null);

  // --- Computed Signal for Filtering ---
  filteredYieldLists = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.yieldLists();

    return this.yieldLists().filter(yieldItem =>
      yieldItem.rName?.toLowerCase().includes(term) ||
      yieldItem.yId.toString().includes(term)
    );
  });

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    this.fetchYieldLists();
  }

  // --- Data Methods ---
  fetchYieldLists(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.ryService.getAllYieldLists().subscribe({
      next: (data) => {
        this.yieldLists.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to fetch yield records.');
        this.isLoading.set(false);
      }
    });
  }

  // --- Template Event Handlers ---
  trackById(index: number, item: YieldResponse): number {
    return item.yId;
  }

  addNewYield(): void {
    this.router.navigate(['/ry-create']);
  }

  onView(yieldItem: YieldResponse): void {
    this.dataToView.set(yieldItem);
    this.isViewModalOpen.set(true);
  }

  onEdit(yieldItem: YieldResponse): void {
    // Navigate to the dedicated edit page with the yield's ID
    this.router.navigate(['/ry-edit', yieldItem.yId]);
  }

  onDelete(yieldId: number): void {
    if (!confirm(`Are you sure you want to delete yield record #${yieldId}?`)) return;

    this.ryService.deleteYieldList(yieldId).subscribe({
      next: () => {
        this.fetchYieldLists(); // Refresh the list on success
        alert('Yield record deleted successfully.');
      },
      error: (err) => alert(`Error deleting yield: ${err.message}`)
    });
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.dataToView.set(null);
  }
}
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Required models and service
import { YieldResponse } from '../../../models/Logistic and Transport/RouteYeildMaintain.model';
import { RyService } from '../../../services/LogisticAndTransport/RouteYieldMaintain.service';

// Child component used in the template
import { RyViewComponent } from '../ry-view/ry-view.component';

@Component({
  selector: 'app-ry-review',
  standalone: true,
  imports: [CommonModule, RyViewComponent], 
  templateUrl: './ry-review.component.html',
  styleUrls: ['./ry-review.component.scss']
})
export class RyReviewComponent implements OnInit {
  // Dependency Injection
  private ryService = inject(RyService);
  private router = inject(Router);

  // --- State Signals ---
  private allYields = signal<YieldResponse[]>([]); // Use a private signal for raw data
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  //weight
  selectedWeightFilter = signal('all');

  // --- View Modal Management ---
  isViewModalOpen = signal(false);
  dataToView = signal<YieldResponse | null>(null);

  // --- Computed Signal for Filtering ---
  filteredYieldLists = computed(() => {
    const yields = this.allYields(); // Assuming you renamed the signal to 'allYields'
    const term = this.searchTerm().toLowerCase();
    const weightFilter = this.selectedWeightFilter();

    return yields.filter(yieldItem => {
      // Search logic (remains the same)
      const matchesSearch = term === '' ||
        yieldItem.rName?.toLowerCase().includes(term) ||
        yieldItem.yId.toString().includes(term);

      // --- NEW: Weight filter logic ---
      // We parse the 'collected_Yield' string to get a number for comparison
      const yieldWeight = parseFloat(yieldItem.collected_Yield);
      if (isNaN(yieldWeight)) return matchesSearch; // If parsing fails, just use search

      let matchesFilter = true;
      if (weightFilter === 'low') matchesFilter = yieldWeight < 100;
      else if (weightFilter === 'medium') matchesFilter = yieldWeight >= 100 && yieldWeight <= 300;
      else if (weightFilter === 'high') matchesFilter = yieldWeight > 300;
      
      return matchesSearch && matchesFilter;
    });
  });

  ngOnInit(): void {
    this.fetchYieldLists();
  }

  fetchYieldLists(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.ryService.getAllYieldLists().subscribe({
      next: (data) => {
        this.allYields.set(data);
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
    this.router.navigate(['/ry-create']); // Or whatever your create page route is
  }

  onView(yieldItem: YieldResponse): void {
    this.dataToView.set(yieldItem);
    this.isViewModalOpen.set(true);
  }

  onEdit(yieldItem: YieldResponse): void {
    // Navigate to the dedicated edit page with the yield's ID
    this.router.navigate(['/ry-edit', yieldItem.yId]);
    console.log("Edit is clicked");
  }

  onDelete(yieldId: number): void {
    if (!confirm(`Are you sure you want to delete yield record #${yieldId}?`)) return;

    this.ryService.deleteYieldList(yieldId).subscribe({
      next: () => {
        this.fetchYieldLists(); // Refresh the list from the server
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
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Import the correct model and service
import { CollectorResponse, CreateUpdateCollectorPayload } from '../../../../models/Logistic and Transport/CollectorManagement.model';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';
import { CollectorViewComponent } from '../c-view/c-view.component';
import { CollectorEditComponent } from '../c-edit/c-edit.component';

@Component({
  selector: 'app-collector-review',
  standalone: true,
  imports: [CommonModule,CollectorViewComponent,CollectorEditComponent],
  templateUrl: './c-review.component.html',
  styleUrls: ['./c-review.component.scss']
})
export class CollectorReviewComponent implements OnInit {
  private collectorService = inject(CollectorService);
  private router = inject(Router);

  private allCollectors = signal<CollectorResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  isViewModalOpen = signal(false);
  dataToView = signal<CollectorResponse | null>(null);

  isEditModalOpen = signal(false);
  dataToEdit = signal<CollectorResponse | null>(null);

  filteredCollectors = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allCollectors().filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.collectorId.toString().includes(term)
    );
  });

  ngOnInit(): void {
    this.fetchCollectors();
  }

  fetchCollectors(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.collectorService.getAllCollectors().subscribe({
      next: (data) => {
        this.allCollectors.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  addNewCollector(): void {
    this.router.navigate(['/c-create']);
  }

  onView(collector: CollectorResponse): void {
    this.dataToView.set(collector);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
  }

  onEdit(collector: CollectorResponse): void {
    this.dataToEdit.set(collector);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.dataToEdit.set(null);
  }

  onDelete(collector: CollectorResponse): void {
  const confirmationMessage = `Are you sure you want to delete collector "${collector.name}"?
This action cannot be undone and may fail if the collector is currently assigned to a route.`;
  
  if (!confirm(confirmationMessage)) {
    return; 
  }
  
  this.isLoading.set(true); 

  
  this.collectorService.deleteCollector(collector.collectorId).subscribe({
    next: () => {
      
      this.fetchCollectors(); 
      alert(`Collector "${collector.name}" was deleted successfully.`);
      this.isLoading.set(false);
    },
    error: (err) => {
      this.isLoading.set(false);
      alert(`Error deleting collector: ${err.message}. They may be assigned to an active route.`);
    }
  });
  }
  handleSave(event: { collectorId: number, payload: CreateUpdateCollectorPayload }): void {
    this.collectorService.updateCollector(event.collectorId, event.payload).subscribe({
      next: () => {
        alert('Collector updated successfully!');
        this.fetchCollectors(); // Refresh data from the server
        this.closeEditModal();  // Close the modal
      },
      error: (err) => alert(`Error updating collector: ${err.message}`)
    });
  }
}
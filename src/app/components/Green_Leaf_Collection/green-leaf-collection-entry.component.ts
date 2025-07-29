import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar/sidebar.component';

import { SupplierService } from '../../Services/supplier.service'; // Import SupplierService
import { GreenLeafCollectionService } from '../../Services/green_leaf_collection.service'; // Import GreenLeafCollectionService
import { Supplier } from '../../models/supplier.interface'; // Import Supplier interface
import { GreenLeafCollection } from '../../models/green-leaf-collection.interface'; // Import GreenLeafCollection interface

@Component({
  selector: 'app-green-leaf-collection-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './green-leaf-collection-entry.component.html',
  styleUrls: ['./green-leaf-collection-entry.component.css']
})
export class GreenLeafCollectionEntryComponent implements OnInit {
  // Form fields
  collectionDate: string = new Date().toISOString().split('T')[0];
  selectedSupplierId: number | null = null;
  
  // Weights (editable by user, auto-populated from initial)
  normalTeaLeafWeight: number | null = null;
  goldenTipTeaLeafWeight: number | null = null;

  // Stores the original initial weights fetched from the external system for comparison
  initialNormalTeaLeafWeight: number | null = null;
  initialGoldenTipTeaLeafWeight: number | null = null;

  suppliers: Supplier[] = []; // List of suppliers for the dropdown
  collectionRecords: GreenLeafCollection[] = []; // Data for the table

  editingCollectionId: number | null = null; // To track if we are editing

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private greenLeafCollectionService: GreenLeafCollectionService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadCollectionRecords();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data;
        console.log('Suppliers loaded:', this.suppliers);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        alert('Failed to load suppliers. Please check backend connection.');
      }
    });
  }

  loadCollectionRecords(): void {
    this.greenLeafCollectionService.getGreenLeafCollections().subscribe({
      next: (data: GreenLeafCollection[]) => {
        // Sort by CollectionId descending (newest first)
        this.collectionRecords = data.sort((a, b) => (b.collectionId || 0) - (a.collectionId || 0));
        console.log('Collection records loaded:', this.collectionRecords);
      },
      error: (error) => {
        console.error('Error loading collection records:', error);
        alert('Failed to load collection records. Please check backend connection.');
      }
    });
  }

  // FIX: Ensure this method is present and correctly named
  public onSupplierChange(): void { // Made public for template access
    if (this.selectedSupplierId) {
      this.supplierService.getInitialWeights(this.selectedSupplierId).subscribe({
        next: (data: Supplier) => {
          this.initialNormalTeaLeafWeight = data.initialNormalTeaLeafWeight;
          this.initialGoldenTipTeaLeafWeight = data.initialGoldenTipTeaLeafWeight;
          
          // Auto-populate editable fields with initial weights
          this.normalTeaLeafWeight = data.initialNormalTeaLeafWeight;
          this.goldenTipTeaLeafWeight = data.initialGoldenTipTeaLeafWeight;
          console.log('Initial weights loaded:', data);
        },
        error: (error) => {
          console.error('Error loading initial weights:', error);
          alert('Initial weights not found for this supplier. Please enter manually.');
          // Clear initial weights and editable fields if not found
          this.initialNormalTeaLeafWeight = null;
          this.initialGoldenTipTeaLeafWeight = null;
          this.normalTeaLeafWeight = null;
          this.goldenTipTeaLeafWeight = null;
        }
      });
    } else {
      // Clear fields if supplier is not selected
      this.initialNormalTeaLeafWeight = null;
      this.initialGoldenTipTeaLeafWeight = null;
      this.normalTeaLeafWeight = null;
      this.goldenTipTeaLeafWeight = null;
    }
  }

  clearForm(): void {
    this.collectionDate = new Date().toISOString().split('T')[0];
    this.selectedSupplierId = null;
    this.normalTeaLeafWeight = null;
    this.goldenTipTeaLeafWeight = null;
    this.initialNormalTeaLeafWeight = null;
    this.initialGoldenTipTeaLeafWeight = null;
    this.editingCollectionId = null;
  }

  editCollection(record: GreenLeafCollection): void {
    this.editingCollectionId = record.collectionId || null;
    this.collectionDate = record.collectionDate;
    this.selectedSupplierId = record.supplierId;
    this.normalTeaLeafWeight = record.normalTeaLeafWeight;
    this.goldenTipTeaLeafWeight = record.goldenTipTeaLeafWeight;
    this.initialNormalTeaLeafWeight = record.initialNormalTeaLeafWeight; // Populate initial for comparison
    this.initialGoldenTipTeaLeafWeight = record.initialGoldenTipTeaLeafWeight; // Populate initial for comparison
  }

  addOrUpdateCollection(): void {
    if (!this.collectionDate || this.selectedSupplierId === null ||
        this.normalTeaLeafWeight === null || this.goldenTipTeaLeafWeight === null ||
        this.initialNormalTeaLeafWeight === null || this.initialGoldenTipTeaLeafWeight === null) {
      alert('Please fill all required fields, including fetching initial weights.');
      return;
    }

    const collectionToSave: GreenLeafCollection = {
      collectionId: this.editingCollectionId || undefined,
      collectionDate: this.collectionDate,
      supplierId: this.selectedSupplierId,
      initialNormalTeaLeafWeight: this.initialNormalTeaLeafWeight,
      initialGoldenTipTeaLeafWeight: this.initialGoldenTipTeaLeafWeight,
      normalTeaLeafWeight: this.normalTeaLeafWeight,
      goldenTipTeaLeafWeight: this.goldenTipTeaLeafWeight,
      hasDifference: false // This will be calculated by the backend
    };

    if (this.editingCollectionId) {
      this.greenLeafCollectionService.updateGreenLeafCollection(this.editingCollectionId, collectionToSave).subscribe({
        next: () => {
          alert('Collection updated successfully!');
          this.clearForm();
          this.loadCollectionRecords();
        },
        error: (error) => {
          console.error('Error updating collection:', error);
          alert('Failed to update collection: ' + error.message);
        }
      });
    } else {
      this.greenLeafCollectionService.addGreenLeafCollection(collectionToSave).subscribe({
        next: (addedCollection) => {
          alert('Collection added successfully!');
          this.clearForm();
          this.loadCollectionRecords();
        },
        error: (error) => {
          console.error('Error adding collection:', error);
          alert('Failed to add collection: ' + error.message);
        }
      });
    }
  }

  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      alert('Cannot delete: Collection ID is missing.');
      return;
    }
    const isConfirmed = confirm('Are you sure you want to delete this collection? This action cannot be undone.');
    if (isConfirmed) {
      this.greenLeafCollectionService.deleteGreenLeafCollection(id).subscribe({
        next: () => {
          alert('Collection deleted successfully!');
          this.loadCollectionRecords();
        },
        error: (error) => {
          console.error('Error deleting collection:', error);
          alert('Failed to delete collection: ' + error.message);
        }
      });
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}

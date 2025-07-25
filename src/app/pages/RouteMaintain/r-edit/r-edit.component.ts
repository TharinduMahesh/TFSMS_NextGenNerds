import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { RouteService } from '../../../services/LogisticAndTransport/RouteMaintain.service';
import { CreateUpdateRoutePayload } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { CollectorService } from '../../../services/LogisticAndTransport/Collector.service';
import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-r-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './r-edit.component.html',
  styleUrls: ['./r-edit.component.scss']
})
export class RtEditComponent implements OnInit {
  // --- Injected Services ---
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);

  // --- Form and State Properties ---
  routeForm: FormGroup;
  currentRouteId: number | null = null;
  availableCollectors = signal<CollectorResponse[]>([]);
  isLoading = true;
  error: string | null = null;

  constructor() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(50)]],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
      collectorId: [null], // We only need to manage collectorId
      growerLocations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Fetch available collectors for the dropdown
    this.collectorService.getAllCollectors().subscribe(collectors => this.availableCollectors.set(collectors));

    // Fetch the route data to edit based on the URL parameter
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error = 'Route ID not found in URL.';
          this.isLoading = false;
          throw new Error('Route ID is required');
        }
        this.currentRouteId = +id;
        return this.routeService.getById(this.currentRouteId);
      })
    ).subscribe({
      next: (routeData) => {
        this.populateForm(routeData);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load route data.';
        this.isLoading = false;
      }
    });
  }

  // Getter for easy access to the growerLocations in the template
  get growerLocations(): FormArray {
    return this.routeForm.get('growerLocations') as FormArray;
  }

  // Fills the form with data fetched from the API
  private populateForm(route: RtList): void {
    this.routeForm.patchValue({
      rName: route.rName,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      distance: route.distance,
      collectorId: route.collectorId,
    });
    this.growerLocations.clear();
    route.growerLocations.forEach(loc => {
      this.growerLocations.push(this.fb.group({
        latitude: [loc.latitude, Validators.required],
        longitude: [loc.longitude, Validators.required],
        description: [loc.description]
      }));
    });
  }
  
  // Methods to dynamically add/remove grower location fields
  addGrowerLocation(): void {
    this.growerLocations.push(this.fb.group({
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
        description: ['']
    }));
  }
  removeGrowerLocation(index: number): void {
    this.growerLocations.removeAt(index);
  }

  // Handles the form submission
  onSubmit(): void {
    if (this.routeForm.invalid || this.currentRouteId === null) {
      alert('Form is invalid. Please correct the errors.');
      return;
    }
    const payload: CreateUpdateRoutePayload = this.routeForm.value;
    this.routeService.updateRoute(this.currentRouteId, payload).subscribe({
      next: () => {
        alert('Route updated successfully!');
        this.router.navigate(['/r-review']);
      },
      error: (err) => alert(`Error: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/r-review']);
  }
}